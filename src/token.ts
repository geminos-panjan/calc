import { constants } from "./constant.js";
import { funcs } from "./func/calc_func.js";

export type TokenType =
  | "ERROR"
  | "SPACE"
  | "INTEGER"
  | "EXPONENT"
  | "FLOAT"
  | "BINARY"
  | "HEX"
  | "STRING"
  | "IDENTIFIER"
  | "CONSTANT"
  | "FUNCTION"
  | "TERM_OPERATOR"
  | "FACTOR_OPERATOR"
  | "EXPONENT_OPERATOR"
  | "OPEN_PAREN"
  | "CLOSE_PAREN"
  | "OPEN_BLACKET"
  | "CLOSE_BLACKET"
  | "COMMA";
export class Token {
  type;
  word;
  depth;

  constructor(type: TokenType, word: string, depth: number = 0) {
    this.type = type;
    this.word = word;
    this.depth = depth;
  }
}

type Parser = {
  pattern: RegExp;
  type: TokenType;
};

const parsers: Parser[] = [
  { pattern: /^\s+/, type: "SPACE" },
  { pattern: /^0b[01_]+/i, type: "BINARY" },
  { pattern: /^0x[\da-f_]+/i, type: "HEX" },
  {
    pattern: /^([\d_]*\.[\d_]+|[\d_]+\.[\d_]*|[\d_]+)e[+-]?[\d_]+/i,
    type: "EXPONENT",
  },
  {
    pattern: /^([\d_]*\.[\d_]+|[\d_]+\.[\d_]*)/i,
    type: "FLOAT",
  },
  { pattern: /^[\d_]+/, type: "INTEGER" },
  { pattern: /^("(\\"|[^"])*"?|'(\\'|[^'])*'?)/, type: "STRING" },
  { pattern: /^[a-z]\w*/i, type: "IDENTIFIER" },
  { pattern: /^[\+\-]/, type: "TERM_OPERATOR" },
  { pattern: /^[\*\/%]/, type: "FACTOR_OPERATOR" },
  { pattern: /^\^/, type: "EXPONENT_OPERATOR" },
  { pattern: /^\(/, type: "OPEN_PAREN" },
  { pattern: /^\)/, type: "CLOSE_PAREN" },
  { pattern: /^\[/, type: "OPEN_BLACKET" },
  { pattern: /^\]/, type: "CLOSE_BLACKET" },
  { pattern: /^\,/, type: "COMMA" },
];

export const createTokenList = (
  text: string,
  tokens: Token[] = [],
  depth: number = 0
): Token[] => {
  if (text === "") {
    return tokens;
  }
  const parser = parsers.find((p) => p.pattern.test(text));
  if (parser === undefined) {
    tokens.push(new Token("ERROR", text[0]));
    return createTokenList(text.slice(1), tokens);
  }
  const match = parser.pattern.exec(text);
  if (match == null) {
    tokens.push(new Token("ERROR", text[0]));
    return createTokenList(text.slice(1), tokens);
  }
  const type = ((type: TokenType, match: string) => {
    if (type === "IDENTIFIER") {
      if (match in constants) {
        return "CONSTANT";
      }
      if (match in funcs) {
        return "FUNCTION";
      }
      return "ERROR";
    }
    return type;
  })(parser.type, match[0]);
  const nextDepth = ((type: TokenType, depth: number) => {
    if (type === "OPEN_PAREN") {
      return depth + 1;
    }
    if (type === "CLOSE_PAREN") {
      return depth - 1;
    }
    return depth;
  })(parser.type, depth);
  tokens.push(
    new Token(type, match[0], type === "CLOSE_PAREN" ? depth - 1 : depth)
  );
  return createTokenList(text.slice(match[0].length), tokens, nextDepth);
};

const echoTokenList = (s: string) => {
  return (
    "[\n" +
    createTokenList(s)
      .map((t) => `  { t: ${t.type},\tw: "${t.word}",\td: ${t.depth} }`)
      .join(", \n") +
    "\n]"
  );
};

// console.log(echoTokenList("    "));
// console.log(echoTokenList("0b12"));
// console.log(echoTokenList("0x0f"));
// console.log(echoTokenList("0x12"));
// console.log(echoTokenList("0.12"));
// console.log(echoTokenList("0.12e1"));
// console.log(echoTokenList("0.12e-1"));
// console.log(echoTokenList("123"));
// console.log(echoTokenList('"pi"'));
// console.log(echoTokenList("pi"));
// console.log(echoTokenList("+-*/%^"));
// console.log(echoTokenList("(),"));
// console.log(echoTokenList("00b12"));
// console.log(echoTokenList("12x32"));
// console.log(echoTokenList("out"));
// console.log(echoTokenList("1."));
// console.log(echoTokenList(".01"));
// console.log(echoTokenList("1e3"));
// console.log(echoTokenList("1e3"));
// console.log(echoTokenList("1.e3"));
// console.log(echoTokenList(".1e+3"));
// console.log(echoTokenList("1e-3"));
// console.log(echoTokenList("2 * 3"));
// console.log(echoTokenList("1+2*(3/(1+2))"));
// console.log(echoTokenList('"1+2*(3/(1+2))'));
// console.log(echoTokenList("'1+2*(3/(1+2))"));
// console.log(echoTokenList("log('hoge', 2"));
