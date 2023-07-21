type Constant = {
  value: number;
  description: string[];
};

export type ConstantKey =
  | "pi"
  | "e"
  | "lbm"
  | "inch"
  | "feet"
  | "yard"
  | "mile"
  | "kt"
  | "p"
  | "n"
  | "u"
  | "m"
  | "k"
  | "M"
  | "G"
  | "T"
  | "Ki"
  | "Mi"
  | "Gi"
  | "Ti"
  | "c"
  | "g"
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "months"
  | "years"
  | "rad"
  | "ans"
  | "NaN"
  | "Infinity";

export const constants: { [key in ConstantKey]: Constant } = {
  pi: {
    value: Math.PI,
    description: ["円周率"],
  },
  e: {
    value: Math.E,
    description: ["ネイピア数"],
  },
  lbm: {
    value: 0.45359237,
    description: ["1ポンド = 0.45359237kg"],
  },
  inch: {
    value: 25.4,
    description: ["1インチ = 25.4mm"],
  },
  feet: {
    value: 0.3048,
    description: ["1フィート = 0.3048m"],
  },
  yard: {
    value: 0.9144,
    description: ["1ヤード = 0.9144m"],
  },
  mile: {
    value: 1.609344,
    description: ["1マイル = 1.609344km"],
  },
  kt: {
    value: 1.852,
    description: ["1ノット = 1.852km/h"],
  },
  p: {
    value: 1e-12,
    description: ["1ピコ = 1e-12"],
  },
  n: {
    value: 1e-9,
    description: ["1ナノ = 1e-9"],
  },
  u: {
    value: 1e-6,
    description: ["1マイクロ = 1e-6"],
  },
  m: {
    value: 1e-3,
    description: ["1ミリ = 1e-3"],
  },
  k: {
    value: 1e3,
    description: ["1キロ = 1e3"],
  },
  M: {
    value: 1e6,
    description: ["1メガ = 1e6"],
  },
  G: {
    value: 1e9,
    description: ["1ギガ = 1e9"],
  },
  T: {
    value: 1e12,
    description: ["1テラ = 1e12"],
  },
  Ki: {
    value: 2 ** 10,
    description: ["1キビ = 2 ** 10"],
  },
  Mi: {
    value: 2 ** 20,
    description: ["1メビ, 2 ** 20"],
  },
  Gi: {
    value: 2 ** 30,
    description: ["1ギビ = 2 ** 30"],
  },
  Ti: {
    value: 2 ** 40,
    description: ["1テビ = 2 ** 40"],
  },
  c: {
    value: 299_792_458,
    description: ["光速 299 752 458m/s"],
  },
  g: {
    value: 9.806_65,
    description: ["重力加速度 9.806 65m/s^2"],
  },
  seconds: {
    value: 1e3,
    description: ["1s = 1000ms"],
  },
  minutes: {
    value: 6e4,
    description: ["1min = 60s"],
  },
  hours: {
    value: 36e5,
    description: ["1h = 60min"],
  },
  days: {
    value: 864e5,
    description: ["1d = 24h"],
  },
  weeks: {
    value: 6048e5,
    description: ["1w = 7d"],
  },
  months: {
    value: 2592e6,
    description: ["1M = 30d"],
  },
  years: {
    value: 31536e6,
    description: ["1y = 365d"],
  },
  rad: {
    value: Math.PI / 180,
    description: ["1rad = π / 180[°]"],
  },
  ans: {
    value: 0,
    description: ["前回の計算結果"],
  },
  NaN: {
    value: NaN,
    description: ["非数 (Not a Number)"],
  },
  Infinity: {
    value: Infinity,
    description: ["無限大"],
  },
};
