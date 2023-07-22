import { constants } from "./constant.js";
import { ASTNodeValue, createSyntaxTree } from "./parsing/parsing_syntax.js";
import { TokenType, createTokenList } from "./token.js";

export type FormatType = "DECIMAL" | "BINARY" | "HEX" | "EXPONENTIAL" | "SI";

export const formatsTypes: { [key in FormatType]: (n: number) => string } = {
  DECIMAL: (n) => n.toString(10),
  BINARY: (n) => {
    const bin = Math.abs(n).toString(2);
    const pad = "0b" + bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
    return n < 0 ? "-" + pad : pad;
  },
  HEX: (n) => {
    const hex = Math.abs(n).toString(16);
    const pad = "0x" + hex.padStart(Math.ceil(hex.length / 2) * 2, "0");
    return n < 0 ? "-" + pad : pad;
  },
  EXPONENTIAL: (n) => n.toExponential(),
  SI: (n) => {
    if (n === 0) {
      return "0";
    }
    const abs = Math.abs(n);
    if (abs < constants.p.value * 1e-3) {
      return n.toExponential();
    }
    if (abs < constants.n.value) {
      return roundFloat(n / constants.p.value).toString() + "p";
    }
    if (abs < constants.u.value) {
      return roundFloat(n / constants.n.value).toString() + "n";
    }
    if (abs < constants.m.value) {
      return roundFloat(n / constants.u.value).toString() + "u";
    }
    if (abs < 1) {
      return roundFloat(n / constants.m.value).toString() + "m";
    }
    if (abs < constants.k.value) {
      return n.toString();
    }
    if (abs < constants.M.value) {
      return (n / constants.k.value).toString() + "k";
    }
    if (abs < constants.M.value) {
      return (n / constants.k.value).toString() + "k";
    }
    if (abs < constants.G.value) {
      return (n / constants.M.value).toString() + "M";
    }
    if (abs < constants.T.value) {
      return (n / constants.G.value).toString() + "G";
    }
    return (n / constants.T.value).toString() + "T";
  },
};

const roundFloat = (n: number) => {
  const text = n.toString();
  const zero = /\.\d*?[^0]?(0{6,}\d*)/.exec(text);
  if (zero != undefined) {
    return Number(text.replace(zero[1] ?? "", ""));
  }
  const nine = /(\.\d*?[^9]?)9{6,}\d*/.exec(text);
  if (nine != undefined) {
    const exp = 10 ** (nine[1]?.length ?? 1);
    return Math.round(n * exp) / exp;
  }
  return n;
};

export const calculate = (
  text: string,
  format?: FormatType,
  ans: string = "0"
): ASTNodeValue => {
  const replaced = text.replace(/ans/g, ans);
  if (replaced === "") {
    return "";
  }
  const tokens = createTokenList(replaced);
  const node = createSyntaxTree(tokens);
  if (typeof node.value === "number") {
    const value = roundFloat(node.value);
    if (format !== undefined) {
      return formatsTypes[format](value);
    }
    const nums = tokens.filter((t) =>
      (
        ["BINARY", "EXPONENTIAL", "FLOAT", "HEX", "INTEGER"] as TokenType[]
      ).includes(t.type)
    );
    if (
      nums[0] !== undefined &&
      (["BINARY", "HEX", "EXPONENTIAL"] as FormatType[]).includes(
        nums[0].type as FormatType
      )
    ) {
      return formatsTypes[nums[0].type as FormatType](value);
    }
    return value;
  }
  return node.value;
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
// console.log(calculate("0.1+0.2"));
// console.log(calculate("0.1*9*1000"));
// console.log(calculate("asin(0.5)"));
// console.log(calculate("1/3"));
// console.log(calculate("0.01+0.02"));
// console.log(calculate("pi"));
// console.log(calculate("log("));
// console.log(calculate("log"));
// console.log(calculate(""));
// console.log(calculate("date((time()+30days)"));
// console.log(calculate("date((time()+months)"));
// console.log(calculate("date((time()+365days)"));
// console.log(calculate("date(time()+years)"));
// console.log(calculate('date(time("2023-01-25 11:54:00.000"))'));
