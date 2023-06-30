import { InvalidArgsError, ZeroDivisionError } from "../../error.js";
import { gcd } from "./euclid.js";
import { convertBase, decimal } from "./base_conversion.js";
import { expressPrimeFactors } from "./prime_factor.js";
import { CalcFunction, mapNumList } from "../calc_func.js";

export type MathFunctionKey =
  | "log"
  | "rand"
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
  | "floor"
  | "prime"
  | "cvtbase"
  | "reduct"
  | "permut"
  | "combin";

export const mathFuncs: { [key in MathFunctionKey]: CalcFunction } = {
  log: {
    funcs: {
      0: () => Math.LOG10E,
      1: (n: any) => {
        Math.log10(n);
      },
      2: (a: any, b: any) => {
        if (Math.log(b) === 0) {
          throw new ZeroDivisionError("log(n, m), log(m) = 0");
        }
        return Math.log(a) / Math.log(b);
      },
    },
    description: [
      "1. log() 常用対数",
      "2. log(n) nの常用対数",
      "3. log(a, b) bを底とするaの対数",
    ],
  },
  rand: {
    funcs: {
      0: () => Math.random(),
      1: (n: any) => Math.floor(Math.random() * n) + 1,
      2: (a: any, b: any) => {
        if (a >= b) {
          throw new InvalidArgsError("rand(a, b), a < b");
        }
        return Math.floor(Math.random() * b - a + 1) + a;
      },
    },
    description: [
      "1. rand() 0以上1未満のランダムな小数",
      "2. rand(n) 1以上n以下のランダムな整数",
      "3. rand(a, b) a以上b未満のランダムな整数",
    ],
  },
  fact: {
    funcs: {
      1: (n: any) => {
        if (n < 0 || isNaN(Number(n))) {
          throw new InvalidArgsError("fact(n), n >= 0");
        }
        if (!Number.isInteger(n)) {
          throw new InvalidArgsError(`fact(n), "${n}" is not an integer`);
        }
        return new Array(n)
          .fill(0)
          .map((_, i) => i + 1)
          .reduce((a, b) => a * b);
      },
    },
    description: ["fact(n) nの階乗"],
  },
  sin: {
    funcs: {
      1: (n: any) => {
        return Math.sin((n * Math.PI) / 180);
      },
    },
    description: ["sin(θ) θ[°]での正弦"],
  },
  cos: {
    funcs: {
      1: (n: any) => {
        return Math.cos((n * Math.PI) / 180);
      },
    },
    description: ["cos(θ) θ[°]での余弦"],
  },
  tan: {
    funcs: {
      1: (n: any) => {
        return Math.tan((n * Math.PI) / 180);
      },
    },
    description: ["tan(θ) θ[°]での正接"],
  },
  asin: {
    funcs: { 1: (n: any) => Math.asin(n) / (Math.PI / 180) },
    description: ["asin(n) nでの逆正弦"],
  },
  acos: {
    funcs: { 1: (n: any) => Math.acos(n) / (Math.PI / 180) },
    description: ["acos(n) nでの逆余弦"],
  },
  atan: {
    funcs: { 1: (n: any) => Math.atan(n) / (Math.PI / 180) },
    description: ["atan(n) nでの逆正接"],
  },
  gcd: {
    funcs: {
      2: (a: any, b: any) => {
        const [n, m] = mapNumList([a, b]);
        return gcd(n, m);
      },
    },
    description: ["gcd(a, b) aとbの最大公約数"],
  },
  lcm: {
    funcs: {
      2: (a: any, b: any) => {
        const [n, m] = mapNumList([a, b]);
        return (n / gcd(n, m)) * m;
      },
    },
    description: ["lcm(a, b) aとbの最小公倍数"],
  },
  sqrt: {
    funcs: {
      1: (n: any) => Math.sqrt(n),
      2: (a: any, b: any) => a ** (1 / b),
    },
    description: ["1. sqrt(n) nの平方根", "2. sqrt(a, b) aのb乗根"],
  },
  floor: {
    funcs: { 1: (n: any) => Math.floor(n) },
    description: ["floor(n) n以下の最大の整数"],
  },
  prime: {
    funcs: {
      1: (n: any) => {
        if (n < 2) {
          throw new InvalidArgsError(`prime(n), n >= 2`);
        }
        return expressPrimeFactors(n);
      },
    },
    description: ["prime(n) nの素因数分解"],
  },
  cvtbase: {
    funcs: {
      3: (s: string, fromBase: any, toBase: any) => {
        if (
          fromBase < 2 ||
          64 < fromBase ||
          toBase < 2 ||
          64 < toBase ||
          isNaN(Number(fromBase)) ||
          isNaN(Number(toBase))
        ) {
          throw new InvalidArgsError(
            "cvtbase(s, from, to), 2 <= (from | to) <= 64"
          );
        }
        if ([2, 8, 10, 16].includes(fromBase)) {
          const prefix: { [key: number]: string } = {
            2: "0b",
            8: "0o",
            10: "",
            16: "0x",
          };
          const num = Number(prefix[fromBase] + s);
          if (isNaN(num)) {
            throw new InvalidArgsError(
              `cvtbase(s, from, to), "${s}" is not a number`
            );
          }
          if ([2, 8, 10, 16].includes(toBase)) {
            return num.toString(toBase);
          }
          return convertBase(num, toBase);
        }
        const dec = decimal(String(s), fromBase);
        if (isNaN(dec)) {
          throw new InvalidArgsError(
            `cvtbase(s, from, to), Failed converting "${s}"`
          );
        }
        if ([2, 8, 10, 16].includes(toBase)) {
          return dec.toString(toBase);
        }
        return convertBase(dec, toBase);
      },
    },
    description: ['cvtbase("s", to, from) 文字列sをfrom進数からto進数に変換'],
  },
  reduct: {
    funcs: {
      2: (a: any, b: any) => {
        const [n, m] = mapNumList([a, b]);
        const g = gcd(n, m);
        const x = n / g;
        const y = m / g;
        return `${x} : ${y}`;
      },
    },
    description: ["reduct(a, b) aとbを約分"],
  },
  permut: {
    funcs: {
      2: (a: any, b: any) => {
        const [n, m] = mapNumList([a, b]);
        if (n < 1 || m < 1 || n < m) {
          throw new InvalidArgsError("permut(a, b), a > 0, b > 0, a >= b");
        }
        if (!Number.isInteger(n) || !Number.isInteger(m)) {
          throw new InvalidArgsError(
            "permut(a, b), a and b must be an integer"
          );
        }
        return Array(m - 1)
          .fill(0)
          .reduce((p, _, i) => p * (n - i), 1);
      },
    },
    description: ["permut(a, b) a個からb個選ぶ順列の総数"],
  },
  combin: {
    funcs: {
      2: (a: any, b: any) => {
        const [n, m] = mapNumList([a, b]);
        if (n < 1 || m < 1 || n < m) {
          throw new InvalidArgsError("combin(a, b), a > 0, b > 0, a >= b");
        }
        if (!Number.isInteger(n) || !Number.isInteger(m)) {
          throw new InvalidArgsError(
            "combin(a, b), a and b must be an integer"
          );
        }
        return (
          Array(m)
            .fill(0)
            .reduce((p, _, i) => p * (n - i), 1) /
          Array(m)
            .fill(0)
            .reduce((p, _, i) => p * (m - i), 1)
        );
      },
    },
    description: ["combin(a, b) a個からb個選ぶ組合せの総数"],
  },
};

// const time = funcs.time.funcs[1].func([Number("20230612155000000")]);
// console.log(time);
// console.log(funcs.date.funcs[1].func([time]));
// console.log(funcs.fact.funcs[0].func([4]));
