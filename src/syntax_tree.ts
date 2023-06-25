import { ConstantKey, constants } from "./constant.js";
import {
  InvalidTokenError,
  UnexpectedEndError,
  UnexpectedTokenError,
  ZeroDivisionError,
} from "./error.js";
import {
  exponentOperator,
  factorOperators,
  signOperators,
  termOperators,
} from "./operator.js";
import { Token, TokenType, createTokenList } from "./token.js";
import {
  CalcFunctionKey,
  executeFunction,
  funcs,
  mapNumList,
} from "./func/calc_func.js";

type NodeType =
  | "EXPRESSION"
  | "TERM"
  | "FACTOR"
  | "COEFFICIENT"
  | "EXPONENT"
  | "FUNCTION"
  | "ALTER"
  | "ARGUMENT"
  | "CONSTANT"
  | "STRING"
  | "NUMBER";

class Node {
  type;
  value;
  tokens;
  children;

  constructor(
    type: NodeType,
    value: any,
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
  if (
    !(
      ["BINARY", "HEX", "EXPONENT", "FLOAT", "INTEGER"] as TokenType[]
    ).includes(tokens[0].type)
  ) {
    return undefined;
  }
  const value = Number(tokens[0].word.replace("_", ""));
  if (isNaN(value)) {
    throw new InvalidTokenError(`"${tokens[0].word}" is NaN`);
  }
  const node = new Node("NUMBER", value, [tokens[0]]);
  return new ParseResult(tokens.slice(1), node);
};

const parseString = (tokens: Token[]) => {
  const res = parseNumber(tokens);
  if (res !== undefined) {
    return res;
  }
  if (tokens[0].type !== "STRING") {
    return undefined;
  }
  const word = tokens[0].word;
  const node = new Node("STRING", word.slice(1, word.length - 1), [tokens[0]]);
  return new ParseResult(tokens.slice(1), node);
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
      return undefined;
    }
    return parseArgument(
      res.tokens,
      new Node("ARGUMENT", "", [tokens[0]], [res.node])
    );
  }
  if (!(0 in tokens) || tokens[0].type !== "COMMA") {
    return new ParseResult(tokens, node);
  }
  if (!(1 in tokens)) {
    return new ParseResult(tokens.slice(1), node);
  }
  const res = parseExpression(tokens.slice(1));
  if (res === undefined) {
    return new ParseResult(tokens, node);
  }
  node.tokens.push(tokens[0], ...res.node.tokens);
  node.children.push(res.node);
  return parseArgument(res.tokens, node);
};

const parseConstant = (tokens: Token[]) => {
  const res = parseString(tokens);
  if (res !== undefined) {
    return res;
  }
  if (tokens[0].type !== "CONSTANT") {
    return undefined;
  }
  const value = constants[tokens[0].word as ConstantKey].value;
  const node = new Node("CONSTANT", value, [tokens[0]]);
  return new ParseResult(tokens.slice(1), node);
};

const parseFunc = (tokens: Token[]) => {
  {
    const res = parseConstant(tokens);
    if (res !== undefined) {
      return res;
    }
  }
  if (tokens[0].type !== "FUNCTION" || !(tokens[0].word in funcs)) {
    return undefined;
  }
  if (!(1 in tokens)) {
    throw new UnexpectedEndError();
  }
  if (tokens[1].type !== "OPEN_PAREN") {
    throw new UnexpectedTokenError(`"${tokens[1].word}" instead of "("`);
  }
  const res = parseArgument(tokens.slice(2));
  const value = executeFunction(
    tokens[0].word as CalcFunctionKey,
    res?.node.children.map((n) => n.value) ?? []
  );
  if (res === undefined) {
    const closeParen = 2 in tokens && tokens[2].type === "CLOSE_PAREN" ? 1 : 0;
    const resTokens = tokens.slice(0, 2 + closeParen);
    const node = new Node("FUNCTION", value, resTokens);
    return new ParseResult(tokens.slice(2 + closeParen), node);
  }
  const closeParen =
    0 in res.tokens && res.tokens[0].type === "CLOSE_PAREN" ? 1 : 0;
  const resTokens = tokens.slice(0, res.node.tokens.length + 2 + closeParen);
  const node = new Node("FUNCTION", value, resTokens, [res.node]);
  return new ParseResult(res.tokens.slice(closeParen), node);
};

const parseExponent = (tokens: Token[]): ParseResult | undefined => {
  const res = parseFunc(tokens);
  if (res !== undefined) {
    return res;
  }
  if (tokens[0].type === "TERM_OPERATOR") {
    if (!(1 in tokens)) {
      throw new UnexpectedEndError();
    }
    const res = parseFunc(tokens.slice(1));
    if (res === undefined || typeof res.node.value !== "number") {
      throw new UnexpectedTokenError(`"${tokens[1].word}"`);
    }
    const value = signOperators[tokens[0].word](res.node.value);
    const resTokens = tokens.slice(0, res.node.tokens.length + 1);
    const node = new Node("EXPONENT", value, resTokens, [res.node]);
    return new ParseResult(res.tokens, node);
  }
  if (tokens[0].type === "OPEN_PAREN") {
    if (!(1 in tokens)) {
      throw new UnexpectedEndError();
    }
    const res = parseExpression(tokens.slice(1));
    if (res === undefined) {
      throw new UnexpectedTokenError(`"${tokens[1].word}"`);
    }
    const closeParen =
      0 in res.tokens && res.tokens[0].type === "CLOSE_PAREN" ? 1 : 0;
    const resTokens = tokens.slice(0, res.node.tokens.length + 1 + closeParen);
    const node = new Node("EXPONENT", res.node.value, resTokens, [res.node]);
    return new ParseResult(res.tokens.slice(closeParen), node);
  }
  return undefined;
};

const parseCoefficient = (tokens: Token[]) => {
  const resNum = parseExponent(tokens);
  if (resNum === undefined) {
    return undefined;
  }
  if (
    resNum === undefined ||
    !(["NUMBER", "EXPONENT"] as NodeType[]).includes(resNum.node.type) ||
    resNum.node.value === undefined
  ) {
    return resNum;
  }
  if (!(0 in resNum.tokens)) {
    return resNum;
  }
  const resFunc = parseFunc(resNum.tokens);
  if (
    resFunc === undefined ||
    !(["CONSTANT", "FUNCTION"] as NodeType[]).includes(resFunc.node.type) ||
    resFunc.node.value === undefined
  ) {
    return resNum;
  }
  const value = factorOperators["*"](resNum.node.value, resFunc.node.value);
  const resTokens = [...resNum.node.tokens, ...resFunc.node.tokens];
  const resNode = new Node("NUMBER", value, resTokens, [
    resNum.node,
    resFunc.node,
  ]);
  return new ParseResult(resFunc.tokens, resNode);
};

const parseFactor = (tokens: Token[], node?: Node): ParseResult | undefined => {
  if (node === undefined) {
    const res = parseCoefficient(tokens);
    if (res === undefined) {
      return undefined;
    }
    return parseFactor(res.tokens, res.node);
  }
  if (!(0 in tokens) || tokens[0].type !== "EXPONENT_OPERATOR") {
    return new ParseResult(tokens, node);
  }
  if (typeof node.value !== "number") {
    throw new UnexpectedTokenError(`"${tokens[0].word}"`);
  }
  if (!(1 in tokens)) {
    throw new UnexpectedEndError();
  }
  const res = parseCoefficient(tokens.slice(1));
  if (res === undefined || typeof res.node.value !== "number") {
    throw new UnexpectedTokenError(`"${tokens[1].word}"`);
  }
  const value = exponentOperator[tokens[0].word](node.value, res.node.value);
  const resTokens = [...node.tokens, tokens[0], ...res.node.tokens];
  const resNode = new Node("FACTOR", value, resTokens, [node, res.node]);
  return parseFactor(res.tokens, resNode);
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
  if (tokens[0].type !== "FACTOR_OPERATOR") {
    return new ParseResult(tokens, node);
  }
  if (typeof node.value !== "number") {
    throw new UnexpectedTokenError(`${tokens[0].word}`);
  }
  if (!(1 in tokens)) {
    throw new UnexpectedEndError();
  }
  const res = parseFactor(tokens.slice(1));
  if (res === undefined || typeof res.node.value !== "number") {
    throw new UnexpectedTokenError(`${tokens[1].word}`);
  }
  if (["/", "%"].includes(tokens[0].word) && res.node.value === 0) {
    throw new ZeroDivisionError(`${res.node.tokens.join("")} = 0`);
  }
  const value = factorOperators[tokens[0].word](node.value, res.node.value);
  const resTokens = [...node.tokens, tokens[0], ...res.node.tokens];
  const resNode = new Node("TERM", value, resTokens, [node, res.node]);
  return parseTerm(res.tokens, resNode);
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
  if (!(0 in tokens) || tokens[0].type !== "TERM_OPERATOR") {
    return new ParseResult(tokens, node);
  }
  if (typeof node.value !== "number") {
    throw new UnexpectedTokenError(`"${tokens[0].word}"`);
  }
  if (!(1 in tokens)) {
    throw new UnexpectedEndError();
  }
  const res = parseTerm(tokens.slice(1));
  if (res === undefined || typeof res.node.value !== "number") {
    throw new UnexpectedTokenError(`"${tokens[1].word}"`);
  }
  const value = termOperators[tokens[0].word](node.value, res.node.value);
  const resTokens = node.tokens.concat(
    tokens.slice(0, res.node.tokens.length + 1)
  );
  const resNode = new Node("EXPRESSION", value, resTokens, [node, res.node]);
  return parseExpression(res.tokens, resNode);
};

export const createSyntaxTree = (tokens: Token[]) => {
  const nonSpaces = tokens.filter((t) => t.type !== "SPACE");
  if (!(0 in nonSpaces)) {
    throw new UnexpectedEndError();
  }
  const error = nonSpaces.find((t) => t.type === "ERROR");
  if (error !== undefined) {
    throw new InvalidTokenError(`"${error.word}"`);
  }
  const res = parseExpression(nonSpaces);
  if (res === undefined) {
    throw new InvalidTokenError(`"${nonSpaces[0].word}"`);
  }
  if (0 in res.tokens) {
    throw new UnexpectedTokenError(
      `"${res.tokens.map((t) => t.word).join('", "')}"`
    );
  }
  return res.node;
};

const getNodeInfo = (node: Node) => {
  const tokens = node.tokens.map((t) => t.word).join(" ");
  if (typeof node.value === "string") {
    return `[${tokens} = "${node.value}"]`;
  }
  if (tokens === String(node.value)) {
    return `[${tokens}]`;
  }
  return `[${tokens} = ${node.value}]`;
};

const diveNode = (node: Node, depth: number = 1): string => {
  const tabs = new Array(depth).fill("  ").join("");
  const resText = `${tabs}${getNodeInfo(node)}\n`;
  if (!(0 in node.children)) {
    return resText;
  }
  return node.children.reduce((p, c) => p + diveNode(c, depth + 1), resText);
};

const echoSyntaxTree = (text: string) => {
  const tokens = createTokenList(text);
  const node = createSyntaxTree(tokens);
  return `[\n${diveNode(node)}]`;
};

// console.log(echoSyntaxTree("2 * 3"));
// console.log(echoSyntaxTree("10 - 5 - 3"));
// console.log(echoSyntaxTree("2 * (1 + (5 - 3) * 4)"));
// console.log(echoSyntaxTree("-1"));
// console.log(echoSyntaxTree("2 ^ 2 * pi"));
// console.log(echoSyntaxTree("-sum(1, 3, 2 * (6 - 4))"));
// console.log(echoSyntaxTree("sum(-1, -3, 2 * -(6 - 4))"));
// console.log(echoSyntaxTree("5 * pi / (-sum(1, 3, 2 * (6 - 4)))"));
// console.log(echoSyntaxTree("log(100) + log(16777216, 2)"));
// console.log(echoSyntaxTree("-(1+4)"));
// console.log(echoSyntaxTree("255 % (2 ^ 8)"));
// console.log(echoSyntaxTree("0b101 + 0x0f"));
// console.log(echoSyntaxTree("3 * (1 + 2"));
// console.log(echoSyntaxTree("1 + 2) * 3"));
// console.log(echoSyntaxTree("prime(153)"));
// console.log(echoSyntaxTree('cvtbase("Zx", 64, 10)'));
// console.log(echoSyntaxTree("hex(810)"));
// console.log(echoSyntaxTree("bin(30) + hex(16)"));
// console.log(echoSyntaxTree("22pi/22"));
// console.log(echoSyntaxTree("exp("));
// console.log(echoSyntaxTree("exp()"));
// console.log(echoSyntaxTree("exp()"));
// console.log(echoSyntaxTree('length("hoge")'));
// console.log(echoSyntaxTree('length("🍣")'));
// console.log(echoSyntaxTree("date()"));
// console.log(echoSyntaxTree("("));
// console.log(echoSyntaxTree("log(10,"));
// console.log(echoSyntaxTree("2seconds"));
// console.log(echoSyntaxTree("(1+2)seconds"));
// console.log(echoSyntaxTree("4pi^2"));
// console.log(echoSyntaxTree("2^2pi"));
