import { MyDate } from "./date.js";
import { InvalidArgsError, ZeroDivisionError } from "./error.js";

type Func = {
  funcs: { args: number; func: (n: number[]) => number }[];
  description: string[];
};

export const funcs: { [key: string]: Func } = {
  sum: {
    funcs: [
      {
        args: Infinity,
        func: (n) => n.reduce((a, b) => a + b, 0),
      },
    ],
    description: ["sum(n1, n2, ...)", "n1, n2, ...の合計"],
  },
  ave: {
    funcs: [
      {
        args: Infinity,
        func: (n) => n.reduce((a, b) => (a + b) / n.length, 0),
      },
    ],
    description: ["sum(n1, n2, ...)", "n1, n2, ...の合計"],
  },
  log: {
    funcs: [
      { args: 0, func: (n) => Math.LOG10E },
      { args: 1, func: (n) => Math.log10(n[0]) },
      {
        args: 2,
        func: (n) => {
          if (Math.log(n[1]) === 0) {
            throw new ZeroDivisionError("log(n, m), log(m) = 0");
          }
          return Math.log(n[0]) / Math.log(n[1]);
        },
      },
    ],
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
    funcs: [
      { args: 0, func: (n) => Math.random() },
      { args: 1, func: (n) => Math.floor(Math.random() * n[0]) + 1 },
      {
        args: 2,
        func: (n) => {
          if (n[0] >= n[1]) {
            throw new InvalidArgsError("rand(n, m), n < m");
          }
          return Math.floor(Math.random() * n[1] - n[0] + 1) + n[0];
        },
      },
    ],
    description: [
      "1. rand()",
      "0以上1未満のランダムな小数",
      "2. rand(n)",
      "1以上n以下のランダムな整数",
      "3. rand(n, m)",
      "n以上m未満のランダムな整数",
    ],
  },
  date: {
    funcs: [
      {
        args: 0,
        func: (n) => Number(new MyDate().format("yyyyMMddHHmmssSSS")),
      },
      {
        args: 0,
        func: (n) => {
          const d = new MyDate();
          d.setTime(n[0]);
          return Number(d.format("yyyyMMddHHmmssSSS"));
        },
      },
    ],
    description: [
      "1. date()",
      "現在の時間をyyyyMMddHHmmssSSS形式で示す",
      "2. date(n)",
      "UNIX時間n[ミリ秒]からyyyyMMddHHmmssSSS形式の時間に変換",
    ],
  },
  time: {
    funcs: [
      { args: 0, func: (n) => Date.now() },
      {
        args: 1,
        func: (n) => {
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
    ],
    description: [
      "1. time()",
      "現在のUNIX時間[ミリ秒]",
      "2. time(n)",
      "yyyyMMddHHmmssSSS形式の時間nからUNIX時間[ミリ秒]に変換",
    ],
  },
  fact: {
    funcs: [
      {
        args: 1,
        func: (n) => {
          if (n[0] < 0) {
            throw new InvalidArgsError("fact(n), n >= 0");
          }
          return new Array(Math.floor(n[0]))
            .fill(0)
            .map((_, i) => i + 1)
            .reduce((a, b) => a * b);
        },
      },
    ],
    description: ["fact(n)", "nの階乗"],
  },
  deg2rad: {
    funcs: [
      {
        args: 1,
        func: (n) => (Math.PI * n[0]) / 180,
      },
    ],
    description: ["deg2rad(θ)", "θ[°]を弧度に変換"],
  },
  rad2deg: {
    funcs: [
      {
        args: 1,
        func: (n) => (n[0] / Math.PI) * 180,
      },
    ],
    description: ["rad2deg(θ)", "θ[rad]を度に変換"],
  },
  sin: {
    funcs: [
      {
        args: 1,
        func: (n) => {
          const rad = funcs.rad.funcs[0].func;
          return Math.sin(rad(n));
        },
      },
    ],
    description: ["sin(θ)", "θ[°]での正弦"],
  },
  cos: {
    funcs: [
      {
        args: 1,
        func: (n) => {
          const rad = funcs.rad.funcs[0].func;
          return Math.cos(rad(n));
        },
      },
    ],
    description: ["cos(θ)", "θ[°]での余弦"],
  },
  tan: {
    funcs: [
      {
        args: 1,
        func: (n) => {
          const rad = funcs.rad.funcs[0].func;
          return Math.tan(rad(n));
        },
      },
    ],
    description: ["tan(θ)", "θ[°]での正接"],
  },
  gcd: {
    funcs: [
      {
        args: 2,
        func: (n) => {
          const a = n[0] < n[1] ? n[1] : n[0];
          const b = n[0] < n[1] ? n[0] : n[1];
          const r = a % b;
          if (r == 0) {
            return b;
          }
          const gcd = funcs.gcd.funcs[0].func;
          return gcd([b, r]);
        },
      },
    ],
    description: ["gcd(n, m)", "nとmの最大公約数"],
  },
  lcm: {
    funcs: [
      {
        args: 2,
        func: (n) => {
          const gcd = funcs.gcd.funcs[0].func(n);
          return (n[0] / gcd) * n[1];
        },
      },
    ],
    description: ["lcm(n, m)", "nとmの最小公倍数"],
  },
  sqrt: {
    funcs: [
      { args: 1, func: (n) => Math.sqrt(n[0]) },
      { args: 2, func: (n) => n[0] ** (1 / n[1]) },
    ],
    description: ["1. sqrt(n)", "nの平方根", "2. sqrt(n, m)", "nのm乗根"],
  },
};

// const time = funcs.time.funcs[1].func([Number("20230612155000000")]);
// console.log(time);
// console.log(funcs.date.funcs[1].func([time]));
// console.log(funcs.fact.funcs[0].func([4]));
