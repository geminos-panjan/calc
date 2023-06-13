import { constants } from "./constant.js";
import { numericFuncs } from "./func/numeric_func.js";
import { stringFuncs } from "./func/string_func.js";
import { reduceFuncs } from "./func/reduce_func.js";

export const tokenTypes = {
  ERROR: "ERROR",
  NUMBER: "NUMBER",
  INTEGER: "INTEGER",
  EXPONENT: "EXPONENT",
  FLOAT: "FLOAT",
  BINARY: "BINARY",
  HEX: "HEX",
  STRING: "STRING",
  IDENTIFIER: "IDENTIFIER",
  CONSTANT: "CONSTANT",
  FUNCTION: "FUNCTION",
  TERM_OPERATOR: "TERM_OPERATOR",
  FACTOR_OPERATOR: "FACTOR_OPERATOR",
  EXPONENT_OPERATOR: "EXPONENT_OPERATOR",
  OPEN_PAREN: "OPEN_PAREN",
  CLOSE_PAREN: "CLOSE_PAREN",
  OPEN_BLACKET: "OPEN_BLACKET",
  CLOSE_BLACKET: "CLOSE_BLACKET",
  COMMA: "COMMA",
} as const;
const tt = tokenTypes;
export type TokenType = (typeof tt)[keyof typeof tt];

export class Token {
  type;
  word;

  constructor(type: TokenType, word: string) {
    this.type = type;
    this.word = word;
  }
}

type Parser = {
  pattern: RegExp;
  type?: TokenType;
};

const parsers: Parser[] = [
  { pattern: /^\s+/ },
  { pattern: /^0b[01_]+/i, type: tt.BINARY },
  { pattern: /^0x[\da-f_]+/i, type: tt.HEX },
  {
    pattern: /^([\d_]*\.[\d_]+|[\d_]+\.[\d_]*|[\d_]+)e[+-]?[\d_]+/i,
    type: tt.EXPONENT,
  },
  {
    pattern: /^([\d_]*\.[\d_]+|[\d_]+\.[\d_]*)/i,
    type: tt.FLOAT,
  },
  { pattern: /^[\d_]+/, type: tt.INTEGER },
  { pattern: /^"(\\"|[^"])*"/, type: tt.STRING },
  { pattern: /^[a-z]\w*/i, type: tt.IDENTIFIER },
  { pattern: /^[\+\-]/, type: tt.TERM_OPERATOR },
  { pattern: /^[\*\/%]/, type: tt.FACTOR_OPERATOR },
  { pattern: /^\^/, type: tt.EXPONENT_OPERATOR },
  { pattern: /^\(/, type: tt.OPEN_PAREN },
  { pattern: /^\)/, type: tt.CLOSE_PAREN },
  { pattern: /^\[/, type: tt.OPEN_BLACKET },
  { pattern: /^\]/, type: tt.CLOSE_BLACKET },
  { pattern: /^\,/, type: tt.COMMA },
];

export const createTokenList = (text: string, tokens?: Token[]): Token[] => {
  if (tokens === undefined) {
    const ary = Array.from(text);
    const openParens = ary.filter((a) => a === "(").length;
    const closeParens = ary.filter((a) => a === ")").length;
    if (openParens < closeParens) {
      return createTokenList(
        new Array(closeParens - openParens).fill("(").join("") + text,
        []
      );
    }
    return createTokenList(text, []);
  }
  if (text === "") {
    return tokens;
  }
  const parser = parsers.find((p) => p.pattern.test(text));
  if (parser === undefined) {
    tokens.push(new Token(tt.ERROR, text[0]));
    return createTokenList(text.slice(1), tokens);
  }
  const match = parser.pattern.exec(text);
  if (match == null) {
    tokens.push(new Token(tt.ERROR, text[0]));
    return createTokenList(text.slice(1), tokens);
  }
  if (parser.type === undefined) {
    return createTokenList(text.slice(match[0].length), tokens);
  }
  const type = ((type: TokenType, match: string) => {
    if (type === tt.IDENTIFIER) {
      if (match in constants) {
        return tt.CONSTANT;
      }
      if (match in Object.assign({}, numericFuncs, reduceFuncs, stringFuncs)) {
        return tt.FUNCTION;
      }
      return tt.ERROR;
    }
    return type;
  })(parser.type, match[0]);
  tokens.push(new Token(type, match[0]));
  return createTokenList(text.slice(match[0].length), tokens);
};

const echoTokenList = (s: string) => {
  return (
    "[" +
    createTokenList(s)
      .map((t) => `[${t.type}, ${t.word}]`)
      .join(", ") +
    "]"
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
