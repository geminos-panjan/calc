import { InvalidArgsError } from "../../error.js";
import { suddenDeath } from "./sudden.js";
import { full2half } from "./full2half.js";
import { CalcFunction } from "../calc_func.js";

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
    funcs: {
      1: (cp: any) => {
        if (isNaN(Number(cp))) {
          throw new InvalidArgsError(`"${cp}"`);
        }
        return String.fromCodePoint(Number(cp));
      },
    },
    description: ["char(cp)", "コードポイントcpに対応する文字"],
  },
  unicode: {
    funcs: {
      1: (s: any) => {
        const c = Array.from(String(s)).slice(-1)[0];
        const cp = c.codePointAt(0);
        if (cp === undefined) {
          throw new InvalidArgsError(`unicode("c"), "${c}" is invalid`);
        }
        return "U+" + cp.toString(16);
      },
    },
    description: ['unicode("c")', "cのコードポイント"],
  },
  dash: {
    funcs: {
      1: (s: any) => {
        return Array.from(String(s))
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
    description: ['dash("s")', "濁点をつける"],
  },
  full2half: {
    funcs: {
      1: (s: any) => full2half(String(s)),
    },
    description: ['full2half("s")', "全角カナを半角ｶﾅに変換"],
  },
  space: {
    funcs: {
      1: (s: any) => Array.from(String(s)).join("\u3000"),
    },
    description: ['space("s")', "全角スペースを挿入"],
  },
  sudden: {
    funcs: {
      1: (s: any) => suddenDeath(String(s)),
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
      1: (s: any) => Array.from(String(s)).length,
    },
    description: ['length("s")', "sの文字数"],
  },
};

// console.log(stringFuncs.reduct.funcs[2](["153", "132"]));
