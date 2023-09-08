type Constant = {
  value: number;
  description: string[];
};

export type ConstantKey =
  | "pi"
  | "e"
  | "lb"
  | "in"
  | "ft"
  | "yd"
  | "mi"
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
  | "Infinity"
  | "acre"
  | "bbl"
  | "gal"
  | "qt"
  | "pt"
  | "floz"
  | "fldr"
  | "oz"
  | "dr"
  | "gr";

export const constants: { [key in ConstantKey]: Constant } = {
  pi: {
    value: Math.PI,
    description: ["円周率"],
  },
  e: {
    value: Math.E,
    description: ["ネイピア数"],
  },
  lb: {
    value: 0.45359237,
    description: ["1ポンド = 0.45359237kg"],
  },
  in: {
    value: 25.4,
    description: ["1インチ = 1/12フィート(ft) = 25.4mm"],
  },
  ft: {
    value: 0.3048,
    description: ["1フィート = 1/3ヤード(yd) = 0.3048m"],
  },
  yd: {
    value: 0.9144,
    description: ["1ヤード = 0.9144m"],
  },
  mi: {
    value: 1.609344,
    description: ["1マイル = 1760ヤード(yd) = 1.609344km"],
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
  acre: {
    value: 4046,
    description: ["1エーカー = 4046m^2"],
  },
  bbl: {
    value: 158.987294928,
    description: ["1バレル = 42米液量ガロン(gal)"],
  },
  gal: {
    value: 3.785411784,
    description: ["1米液量ガロン = 3.785411784L"],
  },
  qt: {
    value: 0.9464,
    description: ["1米液量クォート = 1/4米液量ガロン(gal) = 0.9464L"],
  },
  pt: {
    value: 0.4732,
    description: ["1米液量パイント = 1/2米液量クォート(qt) = 0.4732L"],
  },
  floz: {
    value: 29.57,
    description: ["1米液量オンス = 1/16米液量パイント(pt) = 29.57mL"],
  },
  fldr: {
    value: 3.6967,
    description: ["1液量ドラム = 1/8米液量オンス(floz) = 3.6967mL"],
  },
  oz: {
    value: 28.349523125,
    description: ["1オンス = 1/16ポンド(lb) = 28.349523125g"],
  },
  dr: {
    value: 1.7718451953125,
    description: ["1ドラム = 1/16オンス(oz) = 1.7718451953125g"],
  },
  gr: {
    value: 64.79891,
    description: ["1グレーン = 1/7000ポンド(lb) = 64.79891mg"],
  },
};
