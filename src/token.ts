import { alters } from "./alter.js";
import { constants } from "./constant.js";
import { InvalidTokenError } from "./error.js";
import { funcs } from "./func.js";

export const tokenTypes = {
  INTEGER: "INTEGER",
  FLOAT: "FLOAT",
  BINARY: "BINARY",
  HEX: "HEX",
  STRING: "STRING",
  IDENTIFIER: "IDENTIFIER",
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
  { pattern: /^0b[01]+/i, type: tt.BINARY },
  { pattern: /^0x[\da-f]+/i, type: tt.HEX },
  { pattern: /^(\d*\.\d+|\d+\.\d*)(e[+-]?\d+)?/i, type: tt.FLOAT },
  { pattern: /^\d+/, type: tt.INTEGER },
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
    throw new InvalidTokenError(`"${text[0]}"`);
  }
  const match = parser.pattern.exec(text);
  if (match == null) {
    throw new InvalidTokenError(`"${text[0]}"`);
  }
  if (parser.type !== undefined) {
    if (
      parser.type === tt.IDENTIFIER &&
      !(match[0] in Object.assign({}, alters, funcs, constants))
    ) {
      throw new InvalidTokenError(`"${match[0]}"`);
    }
    tokens.push(new Token(parser.type, match[0]));
  }
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
