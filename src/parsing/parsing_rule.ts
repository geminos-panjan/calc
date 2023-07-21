import { InvalidArgsError, InvalidTokenError } from "../error.js";
import { executeFunction } from "../func/calc_func.js";
import { CalcFunctionKey, ConstantKey, constants } from "../index.js";
import {
  FactorOperatorKey,
  ShiftOperatorKey,
  TermOperatorKey,
  UnaryOperatorKey,
  andOperator,
  exponentOperator,
  factorOperators,
  orOperator,
  shiftOperators,
  termOperators,
  unaryOperators,
  xorOperator,
} from "../operator.js";
import { ASTNode, ASTNodeValue, ASTNodeState } from "./parsing_syntax.js";

/** 解析パターン */
export type ParsingPattern = {
  /** 状態リスト */
  states: ASTNodeState[];
  /** 抽象構文木ノードリストから値を得る関数 */
  reducer?: (nodes: ASTNode[]) => ASTNodeValue;
};

/** 解析タイプ */
export type ParsingType =
  | "NUMBER"
  | "STRING_LITERAL"
  | "CONSTANT"
  | "ARGUMENT"
  | "FUNCTION"
  | "FUNCTION_LITERAL"
  | "FUNCTION_TAIL"
  | "PAREN"
  | "UNARY_OPERAND"
  | "EXPONENT"
  | "FACTOR"
  | "TERM"
  | "SHIFT_OPERAND"
  | "AND_OPERAND"
  | "XOR_OPERAND"
  | "OR_OPERAND"
  | "EXPRESSION"
  | "SENTENCE";

/** 解析ルール */
export type ParsingRule = {
  /** 解析タイプ */
  state: ParsingType;
  /** 解析パターンリスト */
  patterns: ParsingPattern[];
};

export const parsingTypesSample: { [key in ParsingType]?: string } = {
  NUMBER: "254",
  STRING_LITERAL: '"hoge"',
  CONSTANT: "pi",
  ARGUMENT: "1,2,3",
  FUNCTION: "log(128,2)",
  FUNCTION_LITERAL: "sin(",
  FUNCTION_TAIL: "12,16",
  PAREN: "(2-3)",
  UNARY_OPERAND: "20",
  EXPONENT: "-5",
  FACTOR: "2**3",
  TERM: "4*3",
  SHIFT_OPERAND: "10+2",
  AND_OPERAND: "0xff>>1",
  XOR_OPERAND: "0b101&0x4",
  OR_OPERAND: "0x32^0x5",
  EXPRESSION: "0b11|0b1",
  SENTENCE: "2*(3-5)/4",
};

/**
 * ノードリストから数値を得る
 * @param nodes 抽象構文木ノードリスト
 * @returns 数値
 */
const reduceNumber = (nodes: ASTNode[]): ASTNodeValue => {
  const num = Number(nodes[0]?.value);
  if (isNaN(num)) {
    throw new InvalidTokenError(String(nodes[0]?.value ?? ""));
  }
  return num;
};

/**
 * ノードリストを単項被演算子と解釈して数値を得る
 * @param nodes 抽象構文木ノードリスト
 * @returns 数値
 */
const reduceUnaryOperand = (nodes: ASTNode[]): ASTNodeValue => {
  return factorOperators["*"](nodes[0]?.value, nodes[1]?.value);
};

/**
 * ノードリストを関数と解釈して数値を得る
 * @param nodes 抽象構文木ノードリスト
 * @returns 数値
 */
const parseFunction = (nodes: ASTNode[]): ASTNodeValue => {
  if (nodes[0]?.value === undefined) {
    throw new InvalidTokenError();
  }
  if (nodes[1]?.value === undefined || nodes[1].state !== "ARGUMENT") {
    return executeFunction(nodes[0].value as CalcFunctionKey);
  }
  if (!Array.isArray(nodes[1].value)) {
    throw new InvalidArgsError(String(nodes[1].value));
  }
  return executeFunction(nodes[0].value as CalcFunctionKey, nodes[1].value);
};

/** 解析ルールリスト */
export const parsingRules: ParsingRule[] = [
  {
    state: "NUMBER",
    patterns: [
      { states: ["BINARY"], reducer: reduceNumber },
      { states: ["HEX"], reducer: reduceNumber },
      { states: ["EXPONENTIAL"], reducer: reduceNumber },
      { states: ["FLOAT"], reducer: reduceNumber },
      { states: ["INTEGER"], reducer: reduceNumber },
    ],
  },
  {
    state: "STRING_LITERAL",
    patterns: [
      {
        states: ["STRING"],
        reducer: (nodes) => {
          if (nodes[0]?.value === undefined) {
            throw new InvalidTokenError(String(nodes[0]?.value ?? ""));
          }
          return String(nodes[0]?.value ?? "").replace(/^['"]|['"]$/g, "");
        },
      },
    ],
  },
  {
    state: "CONSTANT",
    patterns: [
      {
        states: ["CONSTANT_KEY"],
        reducer: (nodes) => constants[nodes[0]?.value as ConstantKey].value,
      },
    ],
  },
  {
    state: "ARGUMENT",
    patterns: [
      { states: ["EXPRESSION"], reducer: (nodes) => [nodes[0]?.value] },
      {
        states: ["ARGUMENT", "COMMA", "EXPRESSION"],
        reducer: (nodes) => {
          if (nodes[0]?.value === undefined) {
            throw new InvalidArgsError(nodes[0]?.value);
          }
          const ary = Array.isArray(nodes[0]?.value)
            ? nodes[0]?.value
            : [nodes[0]?.value];
          if (nodes[2]?.value === undefined) {
            return ary;
          }
          return ary.concat(nodes[2]?.value);
        },
      },
    ],
  },
  {
    state: "FUNCTION_LITERAL",
    patterns: [{ states: ["FUNCTION_KEY", "OPEN_PAREN"] }],
  },
  {
    state: "FUNCTION_TAIL",
    patterns: [
      { states: ["CLOSE_PAREN"] },
      { states: ["COMMA", "CLOSE_PAREN"] },
    ],
  },
  {
    state: "FUNCTION",
    patterns: [
      {
        states: ["FUNCTION_LITERAL", "FUNCTION_TAIL"],
        reducer: parseFunction,
      },
      {
        states: ["FUNCTION_LITERAL", "ARGUMENT", "FUNCTION_TAIL"],
        reducer: parseFunction,
      },
    ],
  },
  {
    state: "PAREN",
    patterns: [
      {
        states: ["OPEN_PAREN", "EXPRESSION", "CLOSE_PAREN"],
        reducer: (nodes) => nodes[1]?.value,
      },
    ],
  },
  {
    state: "UNARY_OPERAND",
    patterns: [
      { states: ["NUMBER"] },
      { states: ["CONSTANT"] },
      { states: ["FUNCTION"] },
      { states: ["PAREN"] },
      { states: ["NUMBER", "CONSTANT"], reducer: reduceUnaryOperand },
      { states: ["NUMBER", "FUNCTION"], reducer: reduceUnaryOperand },
      { states: ["NUMBER", "PAREN"], reducer: reduceUnaryOperand },
      { states: ["PAREN", "CONSTANT"], reducer: reduceUnaryOperand },
      { states: ["PAREN", "FUNCTION"], reducer: reduceUnaryOperand },
      { states: ["PAREN", "PAREN"], reducer: reduceUnaryOperand },
    ],
  },
  {
    state: "EXPONENT",
    patterns: [
      { states: ["UNARY_OPERAND"] },
      {
        states: ["TERM_OPERATOR", "UNARY_OPERAND"],
        reducer: (nodes) =>
          unaryOperators[nodes[0]?.value as UnaryOperatorKey]?.(
            nodes[1]?.value
          ),
      },
      {
        states: ["NOT_OPERATOR", "UNARY_OPERAND"],
        reducer: (nodes) =>
          unaryOperators[nodes[0]?.value as UnaryOperatorKey]?.(
            nodes[1]?.value
          ),
      },
    ],
  },
  {
    state: "FACTOR",
    patterns: [
      { states: ["EXPONENT"] },
      {
        states: ["EXPONENT", "EXPONENT_OPERATOR", "FACTOR"],
        reducer: (nodes) =>
          exponentOperator(nodes[0]?.value, nodes[2]?.value ?? 1),
      },
    ],
  },
  {
    state: "TERM",
    patterns: [
      { states: ["FACTOR"] },
      {
        states: ["TERM", "FACTOR_OPERATOR", "FACTOR"],
        reducer: (nodes) =>
          factorOperators[nodes[1]?.value as FactorOperatorKey]?.(
            nodes[0]?.value,
            nodes[2]?.value
          ),
      },
    ],
  },
  {
    state: "SHIFT_OPERAND",
    patterns: [
      { states: ["TERM"] },
      {
        states: ["SHIFT_OPERAND", "TERM_OPERATOR", "TERM"],
        reducer: (nodes) =>
          termOperators[nodes[1]?.value as TermOperatorKey]?.(
            nodes[0]?.value,
            nodes[2]?.value
          ),
      },
    ],
  },
  {
    state: "AND_OPERAND",
    patterns: [
      { states: ["SHIFT_OPERAND"] },
      {
        states: ["AND_OPERAND", "SHIFT_OPERATOR", "SHIFT_OPERAND"],
        reducer: (nodes) =>
          shiftOperators[nodes[1]?.value as ShiftOperatorKey](
            nodes[0]?.value,
            nodes[2]?.value
          ),
      },
    ],
  },
  {
    state: "XOR_OPERAND",
    patterns: [
      { states: ["AND_OPERAND"] },
      {
        states: ["XOR_OPERAND", "AND_OPERATOR", "AND_OPERAND"],
        reducer: (nodes) => andOperator(nodes[0]?.value, nodes[2]?.value),
      },
    ],
  },
  {
    state: "OR_OPERAND",
    patterns: [
      { states: ["XOR_OPERAND"] },
      {
        states: ["OR_OPERAND", "XOR_OPERATOR", "XOR_OPERAND"],
        reducer: (nodes) => xorOperator(nodes[0]?.value, nodes[2]?.value),
      },
    ],
  },
  {
    state: "EXPRESSION",
    patterns: [
      { states: ["STRING_LITERAL"] },
      { states: ["OR_OPERAND"] },
      {
        states: ["EXPRESSION", "OR_OPERATOR", "OR_OPERAND"],
        reducer: (nodes) => orOperator(nodes[0]?.value, nodes[2]?.value),
      },
    ],
  },
  { state: "SENTENCE", patterns: [{ states: ["EXPRESSION"] }] },
];

/** 解析ルールマップ */
export const parsingRuleMap = new Map<ASTNodeState, ParsingRule>(
  parsingRules.map((rule) => [rule.state, rule])
);

/** 非終端記号リスト */
export const nonterminals: Set<ParsingType> = new Set<ParsingType>(
  parsingRules.map((p) => p.state)
);

/**
 * 非終端記号か判定
 * @param state 状態
 * @return 非終端記号ならtrue、終端記号ならfalse
 */
export const isNonterminal = (state: ASTNodeState): boolean => {
  return nonterminals.has(state as ParsingType);
};
