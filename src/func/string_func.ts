import { convertBase, decimal } from "./compornents/base_conversion.js";
import { hsl2rgb, rgb2hsl } from "./compornents/color.js";
import { InvalidArgsError } from "../error.js";
import { expressPrimeFactors } from "./compornents/prime_factor.js";
import { suddenDeath } from "./compornents/sudden.js";
import { full2half } from "./compornents/full2half.js";
import { gcd } from "./compornents/euclid.js";
import { MyDate } from "./compornents/date.js";

type StringFunction = {
  funcs: { [key: number]: (s: string[]) => number | string };
  description: string[];
};

export type StringFunctionKey =
  | "prime"
  | "cvtbase"
  | "rgb2hsl"
  | "hsl2rgb"
  | "char"
  | "unicode"
  | "dash"
  | "full2half"
  | "space"
  | "sudden"
  | "length"
  | "reduct"
  | "date"
  | "time";

export const stringFuncs: { [key in StringFunctionKey]: StringFunction } = {
  prime: {
    funcs: {
      1: (s) => {
        const num = Number(s[0]);
        if (isNaN(num)) {
          throw new InvalidArgsError(`prime(n), "${s[0]}" is not a number"`);
        }
        if (num < 2) {
          throw new InvalidArgsError(`prime(n), n >= 2`);
        }
        return expressPrimeFactors(num);
      },
    },
    description: ["prime(n)", "nの素因数分解"],
  },
  cvtbase: {
    funcs: {
      3: (s) => {
        const num = Number(s[0]);
        const fromBase = Number(s[1]);
        const toBase = Number(s[2]);
        if (isNaN(fromBase)) {
          throw new InvalidArgsError(
            `cvtbase(s, from, to), "${s[1]}" is not a number`
          );
        }
        if (isNaN(toBase)) {
          throw new InvalidArgsError(
            `cvtbase(s, from, to), "${s[2]}" is not a number`
          );
        }
        if (fromBase < 2 || 64 < fromBase || toBase < 2 || 64 < toBase) {
          throw new InvalidArgsError("cvtbase(s, from, to), 2 <= n <= 64");
        }
        if ([2, 8, 10, 16].includes(fromBase)) {
          if (isNaN(num)) {
            throw new InvalidArgsError(
              `cvtbase(s, from, to), "${s[0]}" is not a number`
            );
          }
          return num.toString(toBase);
        }
        const dec = decimal(s[0], fromBase);
        if (isNaN(dec)) {
          throw new InvalidArgsError(
            `cvtbase(s, from, to), Failed converting "${s[0]}"`
          );
        }
        if ([2, 8, 10, 16].includes(toBase)) {
          return dec.toString(toBase);
        }
        return convertBase(dec, toBase);
      },
    },
    description: [
      'cvtbase("s", to, from)',
      "文字列sをfrom進数からto進数に変換",
    ],
  },
  rgb2hsl: {
    funcs: {
      1: (s) => {
        const num = Number(s[0]);
        if (isNaN(num)) {
          throw new InvalidArgsError(`rgb2hsl(rgb), "${s[0]}" is not a number`);
        }
        const r = (num >> 16) & 0xff;
        const g = (num >> 8) & 0xff;
        const b = (num >> 0) & 0xff;
        const hsl = rgb2hsl(r, g, b);
        return `hsl(${hsl.h}deg, ${hsl.s}%, ${hsl.l}%)`;
      },
      3: (s) => {
        const r = Number(s[0]);
        const g = Number(s[1]);
        const b = Number(s[2]);
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
          throw new InvalidArgsError(`rgb2hsl(r, g, b), Not a number`);
        }
        const hsl = rgb2hsl(r, g, b);
        return `hsl(${hsl.h}deg, ${hsl.s}%, ${hsl.l}%)`;
      },
    },
    description: [
      "1. rgb2hsl(rgb)",
      "rgbをhslに変換",
      "2. rgb2hsl(r, g, b)",
      "r, g, bをhslに変換",
    ],
  },
  hsl2rgb: {
    funcs: {
      3: (s) => {
        const h = Number(s[0]);
        const l = Number(s[1]);
        const sa = Number(s[2]);
        if (isNaN(h) || isNaN(l) || isNaN(sa)) {
          throw new InvalidArgsError(`hsl2rgb(h, l, s), Not a number`);
        }
        const rgb = hsl2rgb(h, l, sa);
        const r = Math.floor(rgb.r).toString(16);
        const g = Math.floor(rgb.g).toString(16);
        const b = Math.floor(rgb.b).toString(16);
        return "#" + r + g + b;
      },
    },
    description: [
      "1. hsl2rgb(hsl)",
      "hslをrgbに変換",
      "2. hsl2rgb(h, s, l)",
      "h, s, lをrgbに変換",
    ],
  },
  char: {
    funcs: {
      1: (s) => {
        const cp = Number(s[0]);
        if (isNaN(cp)) {
          throw new InvalidArgsError(`char(cp), "${s[0]}" is not a number`);
        }
        return String.fromCodePoint(cp);
      },
    },
    description: ["char(cp)", "コードポイントcpに対応する文字"],
  },
  unicode: {
    funcs: {
      1: (s) => {
        const c = Array.from(s[0]).slice(-1)[0];
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
      1: (s) => {
        return Array.from(s[0])
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
      1: (s) => full2half(s[0]),
    },
    description: ['full2half("s")', "全角カナを半角ｶﾅに変換"],
  },
  space: {
    funcs: {
      1: (s) => Array.from(s[0]).join("\u3000"),
    },
    description: ['space("s")', "全角スペースを挿入"],
  },
  sudden: {
    funcs: {
      1: (s) => suddenDeath(s[0]),
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
      1: (s) => Array.from(s[0]).length,
    },
    description: ['length("s")', "sの文字数"],
  },
  reduct: {
    funcs: {
      2: (s) => {
        const n = Number(s[0]);
        const m = Number(s[1]);
        if (isNaN(n) || isNaN(m)) {
          throw new InvalidArgsError(`reduct(n, m), Not a number`);
        }
        const g = gcd(n, m);
        const x = n / g;
        const y = m / g;
        return `${x} : ${y}`;
      },
    },
    description: ["reduct(n, m)", "nとmを約分"],
  },
  date: {
    funcs: {
      0: (s) => new MyDate().format("yyyy-MM-dd HH:mm:ss.SSS"),
      1: (s) => {
        const d = new MyDate();
        const n = Number(s[0]);
        if (isNaN(n)) {
          throw new InvalidArgsError(`date(t), "${s[0]}" is not a number`);
        }
        d.setTime(n);
        return d.format("yyyy-MM-dd HH:mm:ss.SSS");
      },
    },
    description: [
      "1. date()",
      '現在の時間を"yyyy-MM-dd HH:mm:ss.SSS"形式で示す',
      "2. date(t)",
      'UNIX時間t[ミリ秒]から"yyyy-MM-dd HH:mm:ss.SSS"形式の時間に変換',
    ],
  },
  time: {
    funcs: {
      0: (s) => Date.now(),
      1: (s) => {
        const regex =
          /(\d{4})[^\d]*(\d{2})[^\d]*(\d{2})[^\d]*(\d{2})[^\d]*(\d{2})[^\d]*(\d{2})[^\d]*(\d{3})?/;
        const m = regex.exec(s[0]);
        if (m === null) {
          throw new InvalidArgsError(s[0]);
        }
        const yyyy = Number(m[1]);
        const MM = Number(m[2]) - 1;
        const dd = Number(m[3]);
        const HH = Number(m[4]);
        const mm = Number(m[5]);
        const ss = Number(m[6]);
        const SSS = Number(m[7] ?? 0);
        const d = new Date(yyyy, MM, dd, HH, mm, ss, SSS);
        return d.getTime();
      },
    },
    description: [
      "1. time()",
      "現在のUNIX時間[ミリ秒]",
      "2. time(t)",
      '"yyyyMMddHHmmssSSS"形式の時間tからUNIX時間[ミリ秒]に変換',
      '"SSS"はなければ000とする',
      "日付要素の間に文字が入っていても変換可",
    ],
  },
};

// console.log(stringFuncs.reduct.funcs[2](["153", "132"]));
