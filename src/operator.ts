import { ZeroDivisionError } from "./error.js";
import { parseNum } from "./func/calc_func.js";
import { ASTNodeValue } from "./parsing/parsing_syntax.js";

export type TermOperatorKey = "+" | "-";
export type FactorOperatorKey = "*" | "/" | "%" | "\\" | "//";
export type UnaryOperatorKey = "+" | "-" | "~";
export type ShiftOperatorKey = "<<" | ">>";
export type ExponentOperatorKey = "**";
export type AndOperatorKey = "&";
export type XorOperatorKey = "^";
export type OrOperatorKey = "|";

export type OperatorKey =
  | TermOperatorKey
  | FactorOperatorKey
  | UnaryOperatorKey
  | ShiftOperatorKey
  | ExponentOperatorKey
  | AndOperatorKey
  | XorOperatorKey
  | OrOperatorKey;

export const operators: OperatorKey[] = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "~",
  "<<",
  ">>",
  "**",
  "&",
  "^",
  "|",
  "\\",
  "//",
];

export const termOperators: {
  [key in TermOperatorKey]: (a: ASTNodeValue, b: ASTNodeValue) => ASTNodeValue;
} = {
  "+": (a, b) => parseNum(a) + parseNum(b),
  "-": (a, b) => parseNum(a) - parseNum(b),
};

export const factorOperators: {
  [key in FactorOperatorKey]: (
    a: ASTNodeValue,
    b: ASTNodeValue
  ) => ASTNodeValue;
} = {
  "*": (a, b) => parseNum(a) * parseNum(b),
  "/": (a, b) => {
    const n = parseNum(a);
    const m = parseNum(b);
    if (m === 0) {
      throw new ZeroDivisionError();
    }
    return n / m;
  },
  "%": (a, b) => {
    const n = parseNum(a);
    const m = parseNum(b);
    if (m === 0) {
      throw new ZeroDivisionError();
    }
    return n % m;
  },
  "\\": (a, b) => {
    const n = parseNum(a);
    const m = parseNum(b);
    if (n === 0) {
      throw new ZeroDivisionError();
    }
    return m / n;
  },
  "//": (a, b) => {
    const n = parseNum(a);
    const m = parseNum(b);
    if (m === 0) {
      throw new ZeroDivisionError();
    }
    return Math.floor(n / m);
  },
};

export const exponentOperator = (a: ASTNodeValue, b: ASTNodeValue) =>
  parseNum(a) ** parseNum(b);

export const unaryOperators: {
  [key in UnaryOperatorKey]: (n: ASTNodeValue) => ASTNodeValue;
} = {
  "+": (n) => parseNum(n),
  "-": (n) => -parseNum(n),
  "~": (n) => ~parseNum(n) >>> 0,
};

export const shiftOperators: {
  [key in ShiftOperatorKey]: (a: ASTNodeValue, b: ASTNodeValue) => ASTNodeValue;
} = {
  "<<": (a, b) => parseNum(a) << parseNum(b),
  ">>": (a, b) => parseNum(a) >> parseNum(b),
};

export const andOperator = (a: ASTNodeValue, b: ASTNodeValue) =>
  parseNum(a) & parseNum(b);
export const xorOperator = (a: ASTNodeValue, b: ASTNodeValue) =>
  parseNum(a) ^ parseNum(b);
export const orOperator = (a: ASTNodeValue, b: ASTNodeValue) =>
  parseNum(a) | parseNum(b);
