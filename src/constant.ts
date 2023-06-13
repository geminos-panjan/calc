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
  | "rad";

export const constants: { [key in ConstantKey]: Constant } = {
  pi: {
    value: Math.PI,
    description: ["pi", "円周率"],
  },
  e: {
    value: Math.E,
    description: ["e", "ネイピア数"],
  },
  lbm: {
    value: 0.45359237,
    description: ["lbm", "1ポンド = 0.45359237kg"],
  },
  inch: {
    value: 25.4,
    description: ["inch", "1インチ = 25.4mm"],
  },
  feet: {
    value: 0.3048,
    description: ["feet", "1フィート = 0.3048m"],
  },
  yard: {
    value: 0.9144,
    description: ["yard", "1ヤード = 0.9144m"],
  },
  mile: {
    value: 1.609344,
    description: ["mile", "1マイル = 1.609344km"],
  },
  kt: {
    value: 1.852,
    description: ["kt", "1ノット = 1.852km/h"],
  },
  n: {
    value: 1e-9,
    description: ["n", "ナノ, 1e-9"],
  },
  u: {
    value: 1e-6,
    description: ["u", "マイクロ, 1e-6"],
  },
  m: {
    value: 1e-3,
    description: ["m", "ミリ, 1e-3"],
  },
  k: {
    value: 1e3,
    description: ["k", "キロ, 1e3"],
  },
  M: {
    value: 1e6,
    description: ["M", "メガ, 1e6"],
  },
  G: {
    value: 1e9,
    description: ["G", "ギガ, 1e9"],
  },
  T: {
    value: 1e12,
    description: ["T", "テラ, 1e12"],
  },
  Ki: {
    value: 2 ** 10,
    description: ["Ki", "キビ, 2 ^ 10"],
  },
  Mi: {
    value: 2 ** 20,
    description: ["Mi", "メビ, 2 ^ 20"],
  },
  Gi: {
    value: 2 ** 30,
    description: ["Gi", "ギビ, 2 ^ 30"],
  },
  Ti: {
    value: 2 ** 40,
    description: ["Ti", "テビ, 2 ^ 40"],
  },
  c: {
    value: 299_792_458,
    description: ["c", "光速, 299 752 458m/s"],
  },
  g: {
    value: 9.806_65,
    description: ["g", "重力加速度, 9.806 65m/s^2"],
  },
  seconds: {
    value: 1e3,
    description: ["seconds", "1s = 1000ms"],
  },
  minutes: {
    value: 6e4,
    description: ["minutes", "1min = 60s"],
  },
  hours: {
    value: 36e5,
    description: ["hours", "1h = 60min"],
  },
  days: {
    value: 864e5,
    description: ["days", "1d = 24h"],
  },
  weeks: {
    value: 6048e5,
    description: ["weeks", "1w = 7d"],
  },
  rad: {
    value: Math.PI / 180,
    description: ["rad", "1rad = π / 180[°]"],
  },
};
