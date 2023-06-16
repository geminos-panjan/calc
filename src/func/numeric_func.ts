import { InvalidArgsError, ZeroDivisionError } from "../error.js";
import { gcd } from "./compornents/euclid.js";

type NumericFunction = {
  funcs: { [key: number]: (n: number[]) => number };
  description: string[];
};

export type NumericFunctionKey =
  | "log"
  | "rand"
  | "time"
  | "fact"
  | "sin"
  | "cos"
  | "tan"
  | "asin"
  | "acos"
  | "atan"
  | "gcd"
  | "lcm"
  | "sqrt"
  | "floor";

export const numericFuncs: { [key in NumericFunctionKey]: NumericFunction } = {
  log: {
    funcs: {
      0: (n) => Math.LOG10E,
      1: (n) => Math.log10(n[0]),
      2: (n) => {
        if (Math.log(n[1]) === 0) {
          throw new ZeroDivisionError("log(n, m), log(m) = 0");
        }
        return Math.log(n[0]) / Math.log(n[1]);
      },
    },
    description: [
      "1. log()",
      "常用対数",
      "2. log(n)",
      "nの常用対数",
      "3. log(n, m)",
      "mを底とするnの対数",
    ],
  },
  rand: {
    funcs: {
      0: (n) => Math.random(),
      1: (n) => Math.floor(Math.random() * n[0]) + 1,
      2: (n) => {
        if (n[0] >= n[1]) {
          throw new InvalidArgsError("rand(n, m), n < m");
        }
        return Math.floor(Math.random() * n[1] - n[0] + 1) + n[0];
      },
    },
    description: [
      "1. rand()",
      "0以上1未満のランダムな小数",
      "2. rand(n)",
      "1以上n以下のランダムな整数",
      "3. rand(n, m)",
      "n以上m未満のランダムな整数",
    ],
  },
  time: {
    funcs: {
      0: (n) => Date.now(),
      1: (n) => {
        const d = new Date();
        d.setMilliseconds(n[0] % 1000);
        d.setSeconds((n[0] / 1e3) % 100);
        d.setMinutes((n[0] / 1e5) % 100);
        d.setHours((n[0] / 1e7) % 100);
        d.setDate((n[0] / 1e9) % 100);
        d.setMonth(((n[0] / 1e11) % 100) - 1);
        d.setFullYear(n[0] / 1e13);
        return d.getTime();
      },
    },
    description: [
      "1. time()",
      "現在のUNIX時間[ミリ秒]",
      "2. time(n)",
      "yyyyMMddHHmmssSSS形式の時間nからUNIX時間[ミリ秒]に変換",
    ],
  },
  fact: {
    funcs: {
      1: (n) => {
        if (n[0] < 0) {
          throw new InvalidArgsError("fact(n), n >= 0");
        }
        return new Array(Math.floor(n[0]))
          .fill(0)
          .map((_, i) => i + 1)
          .reduce((a, b) => a * b);
      },
    },
    description: ["fact(n)", "nの階乗"],
  },
  sin: {
    funcs: {
      1: (n) => {
        return Math.sin((n[0] * Math.PI) / 180);
      },
    },
    description: ["sin(θ)", "θ[°]での正弦"],
  },
  cos: {
    funcs: {
      1: (n) => {
        return Math.cos((n[0] * Math.PI) / 180);
      },
    },
    description: ["cos(θ)", "θ[°]での余弦"],
  },
  tan: {
    funcs: {
      1: (n) => {
        return Math.tan((n[0] * Math.PI) / 180);
      },
    },
    description: ["tan(θ)", "θ[°]での正接"],
  },
  asin: {
    funcs: { 1: (n) => Math.asin(n[0]) / (Math.PI / 180) },
    description: ["asin(n)", "nでの逆正弦"],
  },
  acos: {
    funcs: { 1: (n) => Math.acos(n[0]) / (Math.PI / 180) },
    description: ["acos(n)", "nでの逆余弦"],
  },
  atan: {
    funcs: { 1: (n) => Math.atan(n[0]) / (Math.PI / 180) },
    description: ["atan(n)", "nでの逆正接"],
  },
  gcd: {
    funcs: {
      2: (n) => gcd(n[0], n[1]),
    },
    description: ["gcd(n, m)", "nとmの最大公約数"],
  },
  lcm: {
    funcs: {
      2: (n) => {
        return (n[0] / gcd(n[0], n[1])) * n[1];
      },
    },
    description: ["lcm(n, m)", "nとmの最小公倍数"],
  },
  sqrt: {
    funcs: {
      1: (n) => Math.sqrt(n[0]),
      2: (n) => n[0] ** (1 / n[1]),
    },
    description: ["1. sqrt(n)", "nの平方根", "2. sqrt(n, m)", "nのm乗根"],
  },
  floor: {
    funcs: { 1: (n) => Math.floor(n[0]) },
    description: ["floor(n)", "n以下の最大の整数"],
  },
};

// const time = funcs.time.funcs[1].func([Number("20230612155000000")]);
// console.log(time);
// console.log(funcs.date.funcs[1].func([time]));
// console.log(funcs.fact.funcs[0].func([4]));
