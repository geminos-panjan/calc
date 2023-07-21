import { InvalidArgsError } from "../../error.js";
import { suddenDeath } from "./sudden.js";
import { full2half } from "./full2half.js";
import {
  CalcFunction,
  parseNum,
  parseNumList,
  parseString,
} from "../calc_func.js";

export type StringFunctionKey =
  | "char"
  | "unicode"
  | "dash"
  | "full2half"
  | "space"
  | "sudden"
  | "length";

export const stringFuncs: { [key in StringFunctionKey]: CalcFunction } = {
  char: {
    func: (cpList) => {
      return parseNumList(cpList)
        .map((cp) => String.fromCodePoint(cp))
        .join("");
    },
    description: [
      "char(cp1, cp2, ...) コードポイントcp1, cp2, ...に対応する文字列",
    ],
  },
  unicode: {
    funcs: {
      1: (s) => {
        const chars = Array.from(parseString(s));
        return chars
          .map((c) => {
            const cp = c?.codePointAt(0);
            if (cp === undefined) {
              throw new InvalidArgsError(`unicode("c"), ${c} is invalid`);
            }
            return "U+" + cp.toString(16);
          })
          .join(", ");
      },
    },
    description: ['unicode("s") sのコードポイントのリスト'],
  },
  dash: {
    funcs: {
      1: (s) => {
        return Array.from(parseString(s))
          .map((c) => {
            const re =
              /[がぎぐげござじずぜぞだぢづでどばびぶべぼガギグゲゴザジズゼゾダヂヅデドバビブベボ]/;
            if (re.test(c)) {
              return String.fromCharCode(c.charCodeAt(0) - 1) + "゛";
            }
            if (["ゔ", "ヴ"].includes(c)) {
              return String.fromCharCode(c.charCodeAt(0) - 0x4e) + "゛";
            }
            return c + "゛";
          })
          .join("");
      },
    },
    description: ['dash("s") 濁点をつける'],
  },
  full2half: {
    funcs: {
      1: (s) => full2half(parseString(s)),
    },
    description: ['full2half("s") 全角カナを半角ｶﾅに変換'],
  },
  space: {
    funcs: {
      1: (s) => Array.from(parseString(s)).join("\u3000"),
    },
    description: ['space("s") 全角スペースを挿入'],
  },
  sudden: {
    funcs: {
      1: (s) => suddenDeath(parseString(s)),
    },
    description: [
      'sudden("s")',
      "＿人人人人人人＿",
      "＞　突然の死　＜",
      "￣Y^Y^Y^Y^Y^￣",
    ],
  },
  length: {
    funcs: {
      1: (s) => Array.from(parseString(s)).length,
    },
    description: ['length("s") sの文字数'],
  },
};

// console.log(stringFuncs.reduct.funcs[2](["153", "132"]));
