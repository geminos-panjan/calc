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
import { Token, createTokenList, tokenTypes as tt } from "./token.js";

const nodeTypes = {
  EXPRESSION: "EXPRESSION",
  TERM: "TERM",
  FACTOR: "FACTOR",
  EXPONENT: "EXPONENT",
  FUNCTION: "FUNCTION",
  ALTER: "ALTER",
  ARGUMENT: "ARGUMENT",
  CONSTANT: "CONSTANT",
  NUMBER: "NUMBER",
} as const;
const nt = nodeTypes;
type NodeType = (typeof nt)[keyof typeof nt];

class Node {
  type;
  value;
  text;
  tokens;
  children;

  constructor(
    type: NodeType,
    value: number = 0,
    text: string = "",
    tokens: Token[] = [],
    children: Node[] = []
  ) {
    this.type = type;
    this.value = value;
    this.text = text;
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
  if (tokens[0].type !== tt.NUMBER) {
    return undefined;
  }
  const value = Number(tokens[0].word);
  if (isNaN(value)) {
    throw new InvalidTokenError(`"${tokens[0].word}" is NaN`);
  }
  const node = new Node(nt.NUMBER, value, value.toString(), [tokens[0]]);
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
      new Node(nt.ARGUMENT, NaN, "", [tokens[0]], [res.node])
    );
  }
  if (!(0 in tokens) || tokens[0].type !== tt.COMMA) {
    return new ParseResult(tokens, node);
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
  const res = parseNumber(tokens);
  if (res !== undefined) {
    return res;
  }
  if (tokens[0].type !== tt.CONSTANT) {
    return undefined;
  }
  const value = constants[tokens[0].word].value;
  const node = new Node(nt.CONSTANT, value, value.toString(), [tokens[0]]);
  return new ParseResult(tokens.slice(1), node);
};

const parseFunc = (tokens: Token[]) => {
  {
    const res = parseConstant(tokens);
    if (res !== undefined) {
      return res;
    }
  }
  if (tokens[0].type !== tt.FUNCTION || !(tokens[0].word in funcs)) {
    return undefined;
  }
  if (!(1 in tokens) && tokens[1].type !== tt.OPEN_PAREN) {
    throw new UnexpectedTokenError(`"${tokens[1].word}" instead of "("`);
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
    const closeParen = 2 in tokens && tokens[2].type === tt.CLOSE_PAREN ? 1 : 0;
    const resTokens = tokens.slice(0, 2 + closeParen);
    const node = new Node(nt.FUNCTION, value, value.toString(), resTokens);
    return new ParseResult(tokens.slice(2 + closeParen), node);
  }
  const closeParen =
    0 in res.tokens && res.tokens[0].type === tt.CLOSE_PAREN ? 1 : 0;
  const resTokens = tokens.slice(0, res.node.tokens.length + 2 + closeParen);
  const node = new Node(nt.FUNCTION, value, value.toString(), resTokens, [
    res.node,
  ]);
  return new ParseResult(res.tokens.slice(closeParen), node);
};

const parseAlter = (tokens: Token[]) => {
  {
    const res = parseFunc(tokens);
    if (res !== undefined) {
      return res;
    }
  }
  if (tokens[0].type !== tt.FUNCTION || !(tokens[0].word in alters)) {
    return undefined;
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
  const args = res.node.children.map((n) => n.value);
  const alter = alters[tokens[0].word].funcs.find((f) =>
    [args.length, Infinity].includes(f.args)
  );
  if (alter === undefined) {
    throw new InvalidArgsError(`"${tokens[0].word}"`);
  }
  const text = alter.func(args);
  const closeParen =
    0 in res.tokens && res.tokens[0].type === tt.CLOSE_PAREN ? 1 : 0;
  const resTokens = tokens.slice(0, res.node.tokens.length + 2 + closeParen);
  const node = new Node(nt.FUNCTION, args[0], text, resTokens, [res.node]);
  return new ParseResult(res.tokens.slice(closeParen), node);
};

const parseExponent = (tokens: Token[]): ParseResult | undefined => {
  const res = parseAlter(tokens);
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
    const resTokens = tokens.slice(0, res.node.tokens.length + 1);
    const node = new Node(nt.EXPONENT, value, value.toString(), resTokens, [
      res.node,
    ]);
    return new ParseResult(res.tokens, node);
  }
  if (tokens[0].type === tt.OPEN_PAREN) {
    if (!(0 in tokens)) {
      throw new UnexpectedEndError();
    }
    const res = parseExpression(tokens.slice(1));
    if (res === undefined) {
      throw new UnexpectedTokenError(`"${tokens[1].word}"`);
    }
    const closeParen =
      0 in res.tokens && res.tokens[0].type === tt.CLOSE_PAREN ? 1 : 0;
    const resTokens = tokens.slice(0, res.node.tokens.length + 1 + closeParen);
    const node = new Node(
      nt.EXPONENT,
      res.node.value,
      res.node.value.toString(),
      resTokens,
      [res.node]
    );
    return new ParseResult(res.tokens.slice(closeParen), node);
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
  const res = parseExponent(tokens.slice(1));
  if (res === undefined) {
    throw new UnexpectedTokenError(`"${tokens[1].word}"`);
  }
  const value = exponentOperator[tokens[0].word](node.value, res.node.value);
  const resTokens = [...node.tokens, tokens[0], ...res.node.tokens];
  const resNode = new Node(nt.FACTOR, value, value.toString(), resTokens, [
    node,
    res.node,
  ]);
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
  if (([nt.NUMBER, nt.EXPONENT] as string[]).includes(node.type)) {
    const res = parseAlter(tokens);
    if (
      res !== undefined &&
      ([nt.CONSTANT, nt.FUNCTION] as string[]).includes(res.node.type)
    ) {
      const value = factorOperators["*"](node.value, res.node.value);
      const resTokens = [...node.tokens, ...res.node.tokens];
      const resNode = new Node(nt.TERM, value, value.toString(), resTokens, [
        node,
        res.node,
      ]);
      return parseTerm(res.tokens, resNode);
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
  const resTokens = [...node.tokens, tokens[0], ...res.node.tokens];
  const resNode = new Node(nt.TERM, value, value.toString(), resTokens, [
    node,
    res.node,
  ]);
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
  const resTokens = node.tokens.concat(
    tokens.slice(0, res.node.tokens.length + 1)
  );
  const resNode = new Node(nt.EXPRESSION, value, value.toString(), resTokens, [
    node,
    res.node,
  ]);
  return parseExpression(res.tokens, resNode);
};

export const createSyntaxTree = (tokens: Token[]) => {
  if (!(0 in tokens)) {
    throw new UnexpectedEndError();
  }
  const error = tokens.find((t) => t.type === tt.ERROR);
  if (error !== undefined) {
    throw new InvalidTokenError(`"${error.word}"`);
  }
  const res = parseExpression(tokens);
  if (res === undefined) {
    throw new InvalidTokenError(`"${tokens[0].word}"`);
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
  if (tokens === node.text || node.text === "") {
    return `[${tokens}]`;
  }
  return `[${tokens} = ${node.text}]`;
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
// console.log(echoSyntaxTree("cvtbase(15, 8)"));
// console.log(echoSyntaxTree("hex(810)"));
// console.log(echoSyntaxTree("bin(30) + hex(16)"));
// console.log(echoSyntaxTree("22pi/22"));
console.log(echoSyntaxTree("exp("));
console.log(echoSyntaxTree("exp()"));
