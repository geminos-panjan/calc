import { createSyntaxTree } from "./syntax_tree.js";
import { Token, TokenType, createTokenList } from "./token.js";

export type FormatType = "DECIMAL" | "BINARY" | "HEX" | "EXPONENT";

export const formatsTypes: { [key in FormatType]: (n: number) => string } = {
  DECIMAL: (n) => n.toString(10),
  BINARY: (n) => {
    const bin = n.toString(2);
    return "0b" + bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  },
  HEX: (n) => {
    const hex = n.toString(16);
    return "0x" + hex.padStart(Math.ceil(hex.length / 2) * 2, "0");
  },
  EXPONENT: (n) => n.toExponential(),
};

const roundFloat = (n: number) => {
  const text = n.toString();
  const zero = /\.\d*?[^0]?(0{6,}\d*)/.exec(text);
  if (zero != undefined) {
    return Number(text.replace(zero[1], ""));
  }
  const nine = /(\.\d*?[^9]?)9{6,}\d*/.exec(text);
  if (nine != undefined) {
    const exp = 10 ** nine[1].length;
    return Math.round(n * exp) / exp;
  }
  return n;
};

export const calculate = (
  text: string,
  format?: FormatType,
  ans: string = ""
) => {
  const tokens = createTokenList(text.replace("ans", ans));
  const node = createSyntaxTree(tokens);
  if (node.value === undefined) {
    return node.text;
  }
  const value = roundFloat(node.value);
  if (format !== undefined) {
    return formatsTypes[format](value);
  }
  const token = tokens.find((t) =>
    (["BINARY", "HEX", "EXPONENT"] as TokenType[]).includes(t.type)
  );
  if (token !== undefined) {
    return formatsTypes[token.type as FormatType](value);
  }
  return value.toString();
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
// console.log(calculate('cvtbase("Zx", 64, 16)'));
// console.log(calculate("22pi/22"));
// console.log(calculate("0b101", "DECIMAL"));
// console.log(calculate("0xf", "DECIMAL"));
console.log(calculate("0.1+0.2"));
// console.log(calculate("0.1*9*1000"));
console.log(calculate("asin(0.5)"));
console.log(calculate("1/3"));
console.log(calculate("0.01+0.02"));
