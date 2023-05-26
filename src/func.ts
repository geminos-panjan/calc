// import { convertBase } from "./base_conversion.js";
import { formatDate } from "./date.js";
import { Info, InvalidArgsError, ZeroDivisionError } from "./error.js";
// import { PrimeFactorFormula } from "./prime_factor.js";
import { Node } from "./syntax_tree.js";

type Func = {
  minNodes: number | null;
  maxNodes: number | null;
  func: (n: Node[]) => number;
  description: string[];
};

export const funcs: { [key: string]: Func } = {
  sum: {
    minNodes: 1,
    maxNodes: null,
    func: (n) => {
      return n.map((n) => n.value).reduce((a, b) => a + b);
    },
    description: ["sum(n1, n2, ...)", "n1, n2, ...の合計"],
  },
  log: {
    minNodes: 0,
    maxNodes: 2,
    func: (n) => {
      if (n.length === 0) {
        return Math.LOG10E;
      }
      if (n[0].value < 1) {
        throw InvalidArgsError([n[0]]);
      }
      if (n.length === 1) {
        return Math.log10(n[0].value);
      }
      if (n[1].value < 1) {
        throw InvalidArgsError([n[1]]);
      }
      if (Math.log(n[1].value) === 0) {
        throw ZeroDivisionError(n[1].start);
      }
      return Math.log(n[0].value) / Math.log(n[1].value);
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
    minNodes: 0,
    maxNodes: 2,
    func: (n) => {
      if (n.length === 0) {
        return Math.random();
      }
      if (n.length === 1) {
        return Math.floor(Math.random() * n[0].value) + 1;
      }
      if (n[0].value >= n[1].value) {
        throw InvalidArgsError(n);
      }
      return (
        Math.floor(Math.random() * (n[1].value - n[0].value + 1)) + n[0].value
      );
    },
    description: [
      "1. rand()",
      "0以上1未満のランダムな小数",
      "2. rand(n)",
      "0以上n未満のランダムな整数",
      "3. rand(n, m)",
      "n以上m未満のランダムな整数",
    ],
  },
  date: {
    minNodes: 0,
    maxNodes: 1,
    func: (n) => {
      const d = new Date();
      if (n.length === 1) {
        d.setTime(n[0].value);
      }
      return Number(formatDate(d, "yyyyMMddHHmmssSSS"));
    },
    description: [
      "1. date()",
      "現在の時間をyyyyMMddHHmmssSSS形式で示す",
      "2. date(n)",
      "UNIX時間n[ミリ秒]からyyyyMMddHHmmssSSS形式の時間に変換",
    ],
  },
  time: {
    minNodes: 0,
    maxNodes: 1,
    func: (n) => {
      if (n.length === 0) {
        return Date.now();
      }
      let t = n[0].value;
      const d = new Date();
      d.setMilliseconds(t % 1000);
      t = Math.floor(t / 1000);
      d.setSeconds(t % 100);
      t = Math.floor(t / 100);
      d.setMinutes(t % 100);
      t = Math.floor(t / 100);
      d.setHours(t % 100);
      t = Math.floor(t / 100);
      d.setDate(t % 100);
      t = Math.floor(t / 100);
      d.setMonth((t % 100) - 1);
      t = Math.floor(t / 100);
      d.setFullYear(t);
      return d.getTime();
    },
    description: [
      "1. time()",
      "現在のUNIX時間[ミリ秒]",
      "2. time(n)",
      "yyyyMMddHHmmssSSS形式の時間nからUNIX時間[ミリ秒]に変換",
    ],
  },
  fact: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      const m = n[0].value;
      if (m < 1) {
        throw InvalidArgsError(n);
      }
      let res = 1;
      for (let i = 0; i < m; i++) {
        res *= m - i;
      }
      return res;
    },
    description: ["fact(n)", "nの階乗"],
  },
  rad: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      return (Math.PI * n[0].value) / 180;
    },
    description: ["rad(θ)", "θ[°]を弧度に変換"],
  },
  sin: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      const rad = funcs.rad.func;
      return Math.sin(rad(n));
    },
    description: ["sin(θ)", "θ[°]での正弦"],
  },
  cos: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      const rad = funcs.rad.func;
      return Math.cos(rad(n));
    },
    description: ["cos(θ)", "θ[°]での余弦"],
  },
  tan: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      const rad = funcs.rad.func;
      return Math.tan(rad(n));
    },
    description: ["tan(θ)", "θ[°]での正接"],
  },
  gcd: {
    minNodes: 2,
    maxNodes: 2,
    func: (n) => {
      let a = n[0].value;
      let b = n[1].value;
      if (a < b) {
        a = n[1].value;
        b = n[0].value;
      }
      let r = a % b;
      while (r != 0) {
        a = b;
        b = r;
        r = a % b;
      }
      return b;
    },
    description: ["gcd(n, m)", "nとmの最大公約数"],
  },
  lcm: {
    minNodes: 2,
    maxNodes: 2,
    func: (n) => {
      const gcd = funcs.gcd.func(n);
      return (n[0].value / gcd) * n[1].value;
    },
    description: ["lcm(n, m)", "nとmの最小公倍数"],
  },
};
