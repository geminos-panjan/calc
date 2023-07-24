import { InvalidArgsError } from "../error.js";
import { ASTNodeValue } from "../parsing/parsing_syntax.js";
import { ColorFuctionKey, colorFuncs } from "./color/color_func.js";
import { DateFunctionKey, dateFuncs } from "./date/date_func.js";
import { MathFunctionKey, mathFuncs } from "./math/math_func.js";
import {
  ReductionFunctionKey,
  reduceFuncs,
} from "./reduction/reduction_func.js";
import { StringFunctionKey, stringFuncs } from "./string/string_func.js";
import { supportFuncs } from "./support/support_func.js";
import { weatherFuncs } from "./weather/weather_func.js";

export type CalcFunctionKey =
  | "help"
  | "search"
  | ColorFuctionKey
  | DateFunctionKey
  | MathFunctionKey
  | ReductionFunctionKey
  | StringFunctionKey;

export type CalcFunction = {
  func?: (n: ASTNodeValue[]) => ASTNodeValue;
  funcs?: { [key: number]: (...n: ASTNodeValue[]) => ASTNodeValue };
  description: string[];
};

export const funcs: { [key in CalcFunctionKey]: CalcFunction } = Object.assign(
  supportFuncs,
  colorFuncs,
  dateFuncs,
  mathFuncs,
  reduceFuncs,
  stringFuncs,
  weatherFuncs
);

export const parseNum = (n: ASTNodeValue): number => {
  const num = Number(n);
  if (isNaN(num)) {
    throw new InvalidArgsError(String(n));
  }
  return num;
};

export const parseString = (n: ASTNodeValue): string => {
  return String(n);
};

export const parseNumList = (n: ASTNodeValue): number[] => {
  if (!Array.isArray(n)) {
    throw new InvalidArgsError(String(n));
  }
  return n.map((v) => parseNum(v));
};

export const parseStringList = (n: ASTNodeValue): string[] => {
  if (!Array.isArray(n)) {
    throw new InvalidArgsError(String(n));
  }
  return n.map((v) => parseString(v));
};

export const executeFunction = (
  key: CalcFunctionKey,
  args: ASTNodeValue[] = []
) => {
  const calcFunc = funcs[key];
  const argc = args.length;
  if (calcFunc.func !== undefined) {
    return calcFunc.func(args);
  }
  if (calcFunc.funcs !== undefined && argc in calcFunc.funcs) {
    return calcFunc.funcs[argc]?.(...args);
  }
  throw new InvalidArgsError(args.join(", "));
};
