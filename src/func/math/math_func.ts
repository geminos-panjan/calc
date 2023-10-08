import { InvalidArgsError, ZeroDivisionError } from "../../error.js";
import { gcd } from "./euclid.js";
import { convertBase, decimal } from "./base_conversion.js";
import { expressPrimeFactors } from "./prime_factor.js";
import {
  CalcFunction,
  parseNum,
  parseNumList,
  parseString,
} from "../calc_func.js";

export type MathFunctionKey =
  | "log"
  | "ln"
  | "log10"
  | "log2"
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
      1: (n) => Math.log10(parseNum(n)),
      2: (a, b) => {
        if (Math.log(parseNum(b)) === 0) {
          throw new ZeroDivisionError("log(n, m), log(m) = 0");
        }
        return Math.log(parseNum(a)) / Math.log(parseNum(b));
      },
    },
    description: [
      "1. log(n) 10を底とするnの対数",
      "2. log(a, b) bを底とするaの対数",
    ],
  },
  ln: {
    funcs: {
      1: (n) => Math.log(parseNum(n)),
    },
    description: ["ln(n) ネイピア数eを底とするnの対数"],
  },
  log10: {
    funcs: {
      1: (n) => Math.log10(parseNum(n)),
    },
    description: ["log10(n) 10を底とするnの対数"],
  },
  log2: {
    funcs: {
      1: (n) => Math.log2(parseNum(n)),
    },
    description: ["log2() 2を底とするnの対数"],
  },
  rand: {
    funcs: {
      0: () => Math.random(),
      1: (n) => Math.floor(Math.random() * parseNum(n)) + 1,
      2: (a, b) => {
        const n = parseNum(a);
        const m = parseNum(b);
        if (n >= m) {
          throw new InvalidArgsError("rand(a, b), a < b");
        }
        return Math.floor(Math.random() * m - n + 1) + n;
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
      1: (n) => {
        const num = parseNum(n);
        if (num < 0) {
          throw new InvalidArgsError("fact(n), n >= 0");
        }
        if (!Number.isInteger(num)) {
          throw new InvalidArgsError(`fact(n), ${num} is not an integer`);
        }
        return Array(num)
          .fill(0)
          .map((_, i) => i + 1)
          .reduce((a, b) => a * b);
      },
    },
    description: ["fact(n) nの階乗"],
  },
  sin: {
    funcs: {
      1: (n) => {
        return Math.sin((parseNum(n) * Math.PI) / 180);
      },
    },
    description: ["sin(θ) θ[°]での正弦"],
  },
  cos: {
    funcs: {
      1: (n) => {
        return Math.cos((parseNum(n) * Math.PI) / 180);
      },
    },
    description: ["cos(θ) θ[°]での余弦"],
  },
  tan: {
    funcs: {
      1: (n) => {
        const angle = parseNum(n);
        if (angle === 90) {
          throw new InvalidArgsError("tan(90) is undefined");
        }
        return Math.tan((parseNum(n) * Math.PI) / 180);
      },
    },
    description: ["tan(θ) θ[°]での正接"],
  },
  asin: {
    funcs: { 1: (n) => Math.asin(parseNum(n)) / (Math.PI / 180) },
    description: ["asin(n) nでの逆正弦"],
  },
  acos: {
    funcs: { 1: (n) => Math.acos(parseNum(n)) / (Math.PI / 180) },
    description: ["acos(n) nでの逆余弦"],
  },
  atan: {
    funcs: { 1: (n) => Math.atan(parseNum(n)) / (Math.PI / 180) },
    description: ["atan(n) nでの逆正接"],
  },
  gcd: {
    funcs: {
      2: (a, b) => {
        const n = parseNum(a);
        const m = parseNum(b);
        return gcd(n, m);
      },
    },
    description: ["gcd(a, b) aとbの最大公約数"],
  },
  lcm: {
    funcs: {
      2: (a, b) => {
        const n = parseNum(a);
        const m = parseNum(b);
        return (n / gcd(n, m)) * m;
      },
    },
    description: ["lcm(a, b) aとbの最小公倍数"],
  },
  sqrt: {
    funcs: {
      1: (n) => Math.sqrt(parseNum(n)),
      2: (a, b) => {
        const n = parseNum(a);
        const m = parseNum(b);
        return n ** (1 / m);
      },
    },
    description: ["1. sqrt(n) nの平方根", "2. sqrt(a, b) aのb乗根"],
  },
  floor: {
    funcs: { 1: (n) => Math.floor(parseNum(n)) },
    description: ["floor(n) n以下の最大の整数"],
  },
  prime: {
    funcs: {
      1: (n) => {
        const num = parseNum(n);
        if (num < 2) {
          throw new InvalidArgsError("prime(n), n >= 2");
        }
        return expressPrimeFactors(num);
      },
    },
    description: ["prime(n) nの素因数分解"],
  },
  cvtbase: {
    funcs: {
      3: (s, fromBase, toBase) => {
        const str = parseString(s);
        const fromBaseNum = parseNum(fromBase);
        const toBaseNum = parseNum(toBase);
        if (
          fromBaseNum < 2 ||
          64 < fromBaseNum ||
          toBaseNum < 2 ||
          64 < toBaseNum
        ) {
          throw new InvalidArgsError(
            "cvtbase(s, from, to), 2 <= (from | to) <= 64"
          );
        }
        if ([2, 8, 10, 16].includes(fromBaseNum)) {
          const prefix: { [key: number]: string } = {
            2: "0b",
            8: "0o",
            10: "",
            16: "0x",
          };
          const num = Number(prefix[fromBaseNum] + str.replace(/-/, ""));
          if (isNaN(num)) {
            throw new InvalidArgsError(
              `cvtbase(s, from, to), "${str}" is not a number`
            );
          }
          if ([2, 8, 10, 16].includes(toBaseNum)) {
            const out = prefix[toBaseNum] + num.toString(toBaseNum);
            return str.startsWith("-") ? "-" + out : out;
          }
          return convertBase(num, toBaseNum);
        }
        const dec = decimal(str, fromBaseNum);
        if (isNaN(dec)) {
          throw new InvalidArgsError(
            `cvtbase(s, from, to), Failed converting "${str}"`
          );
        }
        if ([2, 8, 10, 16].includes(toBaseNum)) {
          return dec.toString(toBaseNum);
        }
        return convertBase(dec, toBaseNum);
      },
    },
    description: ['cvtbase("s", to, from) 文字列sをfrom進数からto進数に変換'],
  },
  reduct: {
    funcs: {
      2: (a, b) => {
        const n = parseNum(a);
        const m = parseNum(b);
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
      2: (a, b) => {
        const n = parseNum(a);
        const m = parseNum(b);
        if (n < 1 || m < 1 || n < m) {
          throw new InvalidArgsError("permut(a, b), a > 0, b > 0, a >= b");
        }
        if (!Number.isInteger(n) || !Number.isInteger(m)) {
          throw new InvalidArgsError(
            "permut(a, b), a and b must be an integer"
          );
        }
        return Array(m)
          .fill(0)
          .reduce((p, _, i) => p * (n - i), 1);
      },
    },
    description: ["permut(a, b) a個からb個選ぶ順列の総数"],
  },
  combin: {
    funcs: {
      2: (a, b) => {
        const n = parseNum(a);
        const m = parseNum(b);
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
