type Constant = {
  value: number;
  description: string[];
};

export const constants: { [key: string]: Constant } = {
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
};
