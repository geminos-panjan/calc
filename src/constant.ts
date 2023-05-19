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
};
