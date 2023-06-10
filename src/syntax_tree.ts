import { alters } from "./alter.js";
import { constants } from "./constant.js";
import {
  InvalidArgsError,
  InvalidTokenError,
  UnexpectedEndError,
  UnexpectedTokenError,
  ZeroDivisionError,
} from "./error.js";
import { funcs } from "./func.js";
import {
  exponentOperator,
  factorOperators,
  signOperators,
  termOperators,
} from "./operator.js";
import {
  Token,
  TokenType,
  createTokenList,
  tokenTypes as tt,
} from "./token.js";

const nodeTypes = {
  EXPRESSION: "EXPRESSION",
  TERM: "TERM",
  FACTOR: "FACTOR",
  EXPONENT: "EXPONENT",
  FUNCTION: "FUNCTION",
  ARGUMENT: "ARGUMENT",
  CONSTANT: "CONSTANT",
  NUMBER: "NUMBER",
} as const;
const nt = nodeTypes;
type NodeType = (typeof nt)[keyof typeof nt];

class Node {
  type;
  value;
  tokens;
  children;

  constructor(
    type: NodeType,
    value: number = 0,
    tokens: Token[] = [],
    children: Node[] = []
  ) {
    this.type = type;
    this.value = value;
    this.tokens = tokens;
    this.children = children;
  }
}

class ParseResult {
  tokens;
  node;
  constructor(tokens: Token[], node: Node) {
    this.tokens = tokens;
    this.node = node;
  }
}

const parseNumber = (tokens: Token[]) => {
  const numberTypes = [tt.BINARY, tt.HEX, tt.FLOAT, tt.INTEGER];
  if (!(numberTypes as string[]).includes(tokens[0].type)) {
    return undefined;
  }
  const value = Number(tokens[0].word);
  if (isNaN(value)) {
    throw new InvalidTokenError(`"${tokens[0].word}" is NaN`);
  }
  return new ParseResult(
    tokens.slice(1),
    new Node(nt.NUMBER, value, [tokens[0]])
  );
};

const parseArgument = (
  tokens: Token[],
  node?: Node
): ParseResult | undefined => {
  if (node === undefined) {
    if (!(0 in tokens)) {
      return undefined;
    }
    const res = parseExpression(tokens);
    if (res === undefined) {
      throw new UnexpectedTokenError(`"${tokens[0].word}"`);
    }
    return parseArgument(
      res.tokens,
      new Node(nt.ARGUMENT, NaN, [tokens[0]], [res.node])
    );
  }
  if (!(0 in tokens) || tokens[0].type !== tt.COMMA) {
    return new ParseResult(tokens, node);
  }
  const res = parseExpression(tokens.slice(1));
  if (res === undefined) {
    return new ParseResult(tokens, node);
  }
  node.tokens.push(tokens[0], ...res.tokens);
  node.children.push(res.node);
  return parseArgument(res.tokens, node);
};

const parseConstant = (tokens: Token[]) => {
  const res = parseNumber(tokens);
  if (res !== undefined) {
    return res;
  }
  if (tokens[0].type !== tt.IDENTIFIER || !(tokens[0].word in constants)) {
    return undefined;
  }
  const value = constants[tokens[0].word].value;
  return new ParseResult(
    tokens.slice(1),
    new Node(nt.CONSTANT, value, [tokens[0]])
  );
};

const parseFunc = (tokens: Token[]) => {
  {
    const res = parseConstant(tokens);
    if (res !== undefined) {
      return res;
    }
  }
  if (tokens[0].type !== tt.IDENTIFIER || !(tokens[0].word in funcs)) {
    return undefined;
  }
  if (!(1 in tokens) && tokens[1].type !== tt.OPEN_PAREN) {
    throw new UnexpectedTokenError(`"${tokens[1].word}" instead of "("`);
  }
  if (!(2 in tokens)) {
    throw new UnexpectedEndError();
  }
  const res = parseArgument(tokens.slice(2));
  const args = res !== undefined ? res.node.children.map((n) => n.value) : [];
  const func = funcs[tokens[0].word].funcs.find((f) =>
    [args.length, Infinity].includes(f.args)
  );
  if (func === undefined) {
    throw new InvalidArgsError("Args length is invalid");
  }
  const value = func.func(args);
  if (res === undefined) {
    if (2 in tokens && tokens[2].type === tt.CLOSE_PAREN) {
      return new ParseResult(
        tokens.slice(3),
        new Node(nt.FUNCTION, value, tokens.slice(0, 3))
      );
    }
    return new ParseResult(
      tokens.slice(2),
      new Node(nt.FUNCTION, value, tokens.slice(0, 2))
    );
  }
  if (0 in res.tokens && res.tokens[0].type === tt.CLOSE_PAREN) {
    return new ParseResult(
      res.tokens.slice(1),
      new Node(
        nt.FUNCTION,
        value,
        tokens.slice(0, res.node.tokens.length + 3),
        [res.node]
      )
    );
  }
  return new ParseResult(
    res.tokens,
    new Node(nt.FUNCTION, value, tokens.slice(0, res.node.tokens.length + 2), [
      res.node,
    ])
  );
};

const parseExponent = (tokens: Token[]): ParseResult | undefined => {
  const res = parseFunc(tokens);
  if (res !== undefined) {
    return res;
  }
  if (tokens[0].type === tt.TERM_OPERATOR) {
    if (!(1 in tokens)) {
      throw new UnexpectedEndError();
    }
    const res = parseExponent(tokens.slice(1));
    if (res === undefined) {
      throw new UnexpectedTokenError(`"${tokens[1].word}"`);
    }
    const value = signOperators[tokens[0].word](res.node.value);
    return new ParseResult(
      res.tokens,
      new Node(
        nt.EXPONENT,
        value,
        tokens.slice(0, res.node.tokens.length + 1),
        [res.node]
      )
    );
  }
  if (tokens[0].type === tt.OPEN_PAREN) {
    if (!(0 in tokens)) {
      throw new UnexpectedEndError();
    }
    const res = parseExpression(tokens.slice(1));
    if (res === undefined) {
      throw new UnexpectedTokenError(`"${tokens[1].word}"`);
    }
    if (0 in res.tokens && res.tokens[0].type === tt.CLOSE_PAREN) {
      return new ParseResult(
        res.tokens.slice(1),
        new Node(
          nt.EXPONENT,
          res.node.value,
          tokens.slice(0, res.node.tokens.length + 1),
          [res.node]
        )
      );
    }
    return new ParseResult(
      res.tokens,
      new Node(
        nt.EXPONENT,
        res.node.value,
        tokens.slice(0, res.node.tokens.length + 1),
        [res.node]
      )
    );
  }
  return undefined;
};

const parseFactor = (tokens: Token[], node?: Node): ParseResult | undefined => {
  if (node === undefined) {
    const res = parseExponent(tokens);
    if (res === undefined) {
      return undefined;
    }
    return parseFactor(res.tokens, res.node);
  }
  if (!(0 in tokens) || tokens[0].type !== tt.EXPONENT_OPERATOR) {
    return new ParseResult(tokens, node);
  }
  if (!(1 in tokens)) {
    throw new UnexpectedEndError();
  }
  const res = parseFunc(tokens.slice(1));
  if (res === undefined) {
    throw new UnexpectedTokenError(`"${tokens[1].word}"`);
  }
  const value = exponentOperator[tokens[0].word](node.value, res.node.value);
  return parseFactor(
    res.tokens,
    new Node(
      nt.FACTOR,
      value,
      node.tokens.concat(tokens.slice(0, res.node.tokens.length + 1)),
      [node, res.node]
    )
  );
};

const parseTerm = (tokens: Token[], node?: Node): ParseResult | undefined => {
  if (node === undefined) {
    const res = parseFactor(tokens);
    if (res === undefined) {
      return undefined;
    }
    return parseTerm(res.tokens, res.node);
  }
  if (!(0 in tokens)) {
    return new ParseResult(tokens, node);
  }
  if (([nt.NUMBER, nt.EXPONENT] as string[]).includes(node.type)) {
    const res = parseFactor(tokens);
    if (
      res !== undefined &&
      ([nt.CONSTANT, nt.FUNCTION] as string[]).includes(res.node.type)
    ) {
      const value = factorOperators["*"](node.value, res.node.value);
      return parseTerm(
        res.tokens,
        new Node(nt.TERM, value, node.tokens.concat(tokens.slice(0, 1)), [
          node,
          res.node,
        ])
      );
    }
  }
  if (tokens[0].type !== tt.FACTOR_OPERATOR) {
    return new ParseResult(tokens, node);
  }
  if (!(1 in tokens)) {
    throw new UnexpectedEndError();
  }
  const res = parseFactor(tokens.slice(1));
  if (res === undefined) {
    throw new UnexpectedTokenError(`${tokens[1].word}`);
  }
  if (["/", "%"].includes(tokens[0].word) && res.node.value === 0) {
    throw new ZeroDivisionError(`${res.node.tokens.join("")} = 0`);
  }
  const value = factorOperators[tokens[0].word](node.value, res.node.value);
  return parseTerm(
    res.tokens,
    new Node(
      nt.TERM,
      value,
      node.tokens.concat(tokens.slice(0, res.node.tokens.length + 1)),
      [node, res.node]
    )
  );
};

const parseExpression = (
  tokens: Token[],
  node?: Node
): ParseResult | undefined => {
  if (node === undefined) {
    const res = parseTerm(tokens);
    if (res === undefined) {
      return undefined;
    }
    return parseExpression(res.tokens, res.node);
  }
  if (!(0 in tokens) || tokens[0].type !== tt.TERM_OPERATOR) {
    return new ParseResult(tokens, node);
  }
  if (!(1 in tokens)) {
    throw new UnexpectedEndError();
  }
  const res = parseTerm(tokens.slice(1));
  if (res === undefined) {
    throw new UnexpectedTokenError(`"${tokens[1].word}"`);
  }
  const value = termOperators[tokens[0].word](node.value, res.node.value);
  return parseExpression(
    res.tokens,
    new Node(
      nt.EXPRESSION,
      value,
      node.tokens.concat(tokens.slice(0, res.tokens.length + 1)),
      [node, res.node]
    )
  );
};

const parseAlter = (tokens: Token[]) => {
  {
    const res = parseExpression(tokens);
    if (res !== undefined) {
      if (0 in res.tokens) {
        throw new UnexpectedTokenError(
          `"${res.tokens.map((t) => t.word).join('", "')}"`
        );
      }
      return res.node.value.toString();
    }
  }
  if (tokens[0].type !== tt.IDENTIFIER || !(tokens[0].word in alters)) {
    throw new InvalidTokenError(`"${tokens[0].word}"`);
  }
  if (!(1 in tokens) && tokens[1].type !== tt.OPEN_PAREN) {
    throw new UnexpectedTokenError(`"${tokens[1].word} instead of ("`);
  }
  if (!(2 in tokens)) {
    throw new UnexpectedEndError();
  }
  const res = parseArgument(tokens.slice(2));
  if (res === undefined) {
    throw new InvalidArgsError("Args length is invalid");
  }
  if (0 in res.tokens && res.tokens[0].type !== tt.CLOSE_PAREN) {
    throw new UnexpectedTokenError(
      `"${res.tokens.map((t) => t.word).join('", "')}"`
    );
  }
  const args = res !== undefined ? res.node.children.map((n) => n.value) : [];
  const alter = alters[tokens[0].word].funcs.find((f) =>
    [args.length, Infinity].includes(f.args)
  );
  if (alter === undefined) {
    throw new InvalidArgsError(`"${tokens[0].word}"`);
  }
  const text = alter.func(args);
  return text;
};

export const calculate = (text: string) => {
  const tokens = createTokenList(text);
  if (!(0 in tokens)) {
    throw new UnexpectedEndError();
  }
  return parseAlter(tokens);
};

// console.log(calculate("2 * 3"));
// console.log(calculate("10 - 5 - 3"));
// console.log(calculate("2 * (1 + (5 - 3) * 4)"));
// console.log(calculate("-1"));
// console.log(calculate("2 ^ 2 * pi"));
// console.log(calculate("-sum(1, 3, 2 * (6 - 4))"));
// console.log(calculate("sum(-1, -3, 2 * -(6 - 4))"));
// console.log(calculate("5 * pi / (-sum(1, 3, 2 * (6 - 4)))"));
// console.log(calculate("log(100) + log(16777216, 2)"));
// console.log(calculate("-(1+4)"));
// console.log(calculate("255 % (2 ^ 8)"));
// console.log(calculate("0b101 + 0x0f"));
// console.log(calculate("3 * (1 + 2"));
// console.log(calculate("1 + 2) * 3"));
// console.log(calculate("prime(153)"));
// console.log(calculate("cvtbase(15, 8)"));
// console.log(calculate("hex(810)"));
// console.log(calculate("bin(30) + hex(16)"));
// console.log(calculate("22pi/22"));
