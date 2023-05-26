import { alters } from "./alter.js";
import { constants } from "./constant.js";
import { InvalidTokenError } from "./error.js";
import { funcs } from "./func.js";
import { Operators as o } from "./operator.js";

let g_formula = "";

export const sliceFormula = (start: number, end: number) => {
  return g_formula.slice(start, end);
};

export const TokenType = Object.freeze({
  NUMBER: 0,
  OPERATOR: 1,
  CONSTANT: 2,
  ALTER: 3,
  FUNC: 4,
});

export type Token = {
  type: number;
  value: string;
  start: number;
  end: number;
};

const tk = TokenType;

const createToken = (
  type: number,
  value: string,
  start: number,
  end: number
) => {
  return { type: type, value: value, start: start, end: end } as Token;
};

const isOpr = (c: string) => {
  return (Object.values(o) as string[]).includes(c);
};

const isConstant = (c: string) => {
  return c in constants;
};

const isAlter = (c: string) => {
  return c in alters;
};

const isFunc = (c: string) => {
  return c in funcs;
};

const NumberToken = (str: string, start: number, end: number) => {
  if (!/^[\d.].*$/.test(str)) {
    return false;
  } else {
    const num = Number(str);
    if (isNaN(num)) {
      console.log(str, num);
      throw InvalidTokenError(str, start);
    }
    const token = createToken(tk.NUMBER, str, start, end);
    return token;
  }
};

const OperatorToken = (c: string, start: number, end: number) => {
  const Num = NumberToken(c, start, end);
  if (Num !== false) {
    return Num;
  } else if (!isOpr(c)) {
    return false;
  } else {
    const token = createToken(tk.OPERATOR, c, start, end);
    return token;
  }
};

const ConstantToken = (c: string, start: number, end: number) => {
  const Opr = OperatorToken(c, start, end);
  if (Opr !== false) {
    return Opr;
  } else if (!isConstant(c)) {
    return false;
  } else {
    const token = createToken(tk.CONSTANT, c, start, end);
    return token;
  }
};

const AlterToken = (c: string, start: number, end: number) => {
  const Const = ConstantToken(c, start, end);
  if (Const !== false) {
    return Const;
  } else if (!isAlter(c)) {
    return false;
  } else {
    const token = createToken(tk.ALTER, c, start, end);
    return token;
  }
};

const FuncToken = (c: string, start: number, end: number) => {
  const Alter = AlterToken(c, start, end);
  if (Alter !== false) {
    return Alter;
  } else if (!isFunc(c)) {
    return false;
  } else {
    const token = createToken(tk.FUNC, c, start, end);
    return token;
  }
};

export const createTokenList = (str: string) => {
  const tokenList: Token[] = [];
  let value = "";
  let start = 0;
  g_formula = str;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === " ") {
      continue;
    }
    if (!isOpr(c)) {
      if (value === "") {
        start = i;
      }
      value += c;
      continue;
    }
    if (value !== "") {
      const Value = FuncToken(value, start, start + value.length);
      if (Value === false) {
        throw InvalidTokenError(value, start);
      }
      tokenList.push(Value);
      value = "";
    }
    const Opr = FuncToken(c, i, i + 1);
    if (Opr === false) {
      throw InvalidTokenError(c, i);
    }
    tokenList.push(Opr);
  }
  if (value !== "") {
    const Value = FuncToken(value, start, start + value.length);
    if (Value === false) {
      throw InvalidTokenError(value, start);
    }
    tokenList.push(Value);
  }
  // console.log(tokenList);
  return tokenList;
};
