import { constants } from "./constant.js";
import { funcs } from "./func/calc_func.js";

export type TokenType =
  | "EOF"
  | "ERROR"
  | "SPACE"
  | "INTEGER"
  | "EXPONENTIAL"
  | "FLOAT"
  | "BINARY"
  | "HEX"
  | "STRING"
  | "IDENTIFIER"
  | "CONSTANT_KEY"
  | "FUNCTION_KEY"
  | "TERM_OPERATOR"
  | "FACTOR_OPERATOR"
  | "EXPONENT_OPERATOR"
  | "OPEN_PAREN"
  | "CLOSE_PAREN"
  | "COMMA"
  | "NOT_OPERATOR"
  | "AND_OPERATOR"
  | "OR_OPERATOR"
  | "XOR_OPERATOR"
  | "SHIFT_OPERATOR";

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

type TokenParser = {
  pattern: RegExp;
  type: TokenType;
};

export const tokenParsers: TokenParser[] = [
  { pattern: /("(\\"|[^"])*"?|'(\\'|[^'])*'?)/, type: "STRING" },
  { pattern: /\s+/, type: "SPACE" },
  { pattern: /0b[01_]+/i, type: "BINARY" },
  { pattern: /0x[\da-f_]+/i, type: "HEX" },
  {
    pattern: /([\d_]*\.[\d_]+|[\d_]+\.[\d_]*|[\d_]+)e[+-]?[\d_]+/i,
    type: "EXPONENTIAL",
  },
  {
    pattern: /([\d_]*\.[\d_]+|[\d_]+\.[\d_]*)/i,
    type: "FLOAT",
  },
  { pattern: /[a-z]\w*/i, type: "IDENTIFIER" },
  { pattern: /[\d_]+/, type: "INTEGER" },
  { pattern: /[\+\-]/, type: "TERM_OPERATOR" },
  { pattern: /\*\*/, type: "EXPONENT_OPERATOR" },
  { pattern: /[\*\/%]/, type: "FACTOR_OPERATOR" },
  { pattern: /\(/, type: "OPEN_PAREN" },
  { pattern: /\)/, type: "CLOSE_PAREN" },
  { pattern: /,/, type: "COMMA" },
  { pattern: /~/, type: "NOT_OPERATOR" },
  { pattern: /&/, type: "AND_OPERATOR" },
  { pattern: /\|/, type: "OR_OPERATOR" },
  { pattern: /\^/, type: "XOR_OPERATOR" },
  { pattern: /(<<|>>)/, type: "SHIFT_OPERATOR" },
];

const switchIdentifier = (identifier: string): TokenType => {
  if (identifier in constants) return "CONSTANT_KEY";
  if (identifier in funcs) return "FUNCTION_KEY";
  return "ERROR";
};

const findMatchWord = (
  text: string
): { type: TokenType; word: string; nextWord: string } => {
  for (const p of tokenParsers) {
    const match = p.pattern.exec(text);
    if (match !== null && match.index === 0) {
      const word = match[0];
      const nextWord = text.slice(match[0].length);
      const type = p.type === "IDENTIFIER" ? switchIdentifier(word) : p.type;
      return { type, word, nextWord };
    }
  }
  return {
    type: "ERROR",
    word: [...text].slice(0, 1)[0] ?? "",
    nextWord: [...text].slice(1).join(""),
  };
};

const updateParenDepth = (tokens: Token[]) => {
  const updated: Token[] = [];
  let depth = 0;
  for (const t of tokens) {
    if (t.type === "CLOSE_PAREN") {
      depth--;
    }
    updated.push(new Token(t.type, t.word, depth));
    if (t.type === "OPEN_PAREN") {
      depth++;
    }
  }
  return updated;
};

export const addParens = (
  tokens: Token[]
): { openParens: number; closeParens: number; tokens: Token[] } => {
  const openParens = tokens.filter((t) => t.type === "OPEN_PAREN").length;
  const closeParens = tokens.filter((t) => t.type === "CLOSE_PAREN").length;
  if (openParens < closeParens) {
    const newTokens = updateParenDepth(
      Array<Token>(closeParens - openParens)
        .fill(new Token("OPEN_PAREN", "("))
        .concat(tokens)
    );
    return {
      openParens: closeParens - openParens,
      closeParens: 0,
      tokens: newTokens,
    };
  }
  if (openParens > closeParens) {
    const newTokens = updateParenDepth(
      tokens.concat(
        Array<Token>(openParens - closeParens).fill(
          new Token("CLOSE_PAREN", ")")
        )
      )
    );
    return {
      openParens: 0,
      closeParens: openParens - closeParens,
      tokens: newTokens,
    };
  }
  return { openParens: 0, closeParens: 0, tokens: updateParenDepth(tokens) };
};

export const createTokenList = (text: string) => {
  const tokens = [new Token("ERROR", text)];
  while (true) {
    const token = tokens.pop();
    if (token === undefined) break;
    const { type, word, nextWord } = findMatchWord(token.word);
    tokens.push(new Token(type, word));
    if (nextWord === "") break;
    tokens.push(new Token("ERROR", nextWord));
  }
  const { openParens, closeParens, tokens: added } = addParens(tokens);
  return added.slice(openParens, added.length - closeParens);
};

const echoTokenList = (s: string) => {
  const tokens = createTokenList(s);
  return { input: s, output: tokens };
};

export const tokenSamples: { [key in TokenType]: string } = {
  AND_OPERATOR: "&",
  BINARY: "0b0101",
  CLOSE_PAREN: ")",
  COMMA: ",",
  CONSTANT_KEY: "pi",
  EOF: "$",
  ERROR: "hoge",
  EXPONENT_OPERATOR: "**",
  EXPONENTIAL: "1.41e-3",
  FACTOR_OPERATOR: "/",
  FLOAT: "2.73",
  FUNCTION_KEY: "log",
  HEX: "0xfe",
  IDENTIFIER: "ans",
  INTEGER: "254",
  NOT_OPERATOR: "~",
  OPEN_PAREN: "(",
  OR_OPERATOR: "|",
  SHIFT_OPERATOR: "<<",
  SPACE: " ",
  STRING: '"jpg"',
  TERM_OPERATOR: "+",
  XOR_OPERATOR: "^",
};

export const getTokenSample = (token: string) => {
  return tokenSamples[token as TokenType] ?? token;
};

export const joinTokenList = (tokens: Token[]) => {
  return tokens.map((t) => t.word).join(" ");
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
// console.log(echoTokenList("~0xff"));
// console.log(echoTokenList("2**3**2"));
// console.log(echoTokenList("2**(3**2"));
// console.log(echoTokenList("2**3)**2"));
