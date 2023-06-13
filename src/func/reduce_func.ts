type ReduceFunction = {
  func: (n: number[]) => number;
  description: string[];
};

export type ReduceFunctionKey = "sum" | "ave" | "max" | "min";

export const reduceFuncs: { [key in ReduceFunctionKey]: ReduceFunction } = {
  sum: {
    func: (n) => n.reduce((a, b) => a + b, 0),
    description: ["sum(n1, n2, ...)", "n1, n2, ...の合計"],
  },
  ave: {
    func: (n) => n.reduce((a, b) => (a + b) / n.length, 0),
    description: ["sum(n1, n2, ...)", "n1, n2, ...の合計"],
  },
  max: {
    func: (n) => n.reduce((a, b) => (a < b ? b : a), 0),
    description: ["max(n1, n2, ...)", "n1, n2, ...の最大値"],
  },
  min: {
    func: (n) => n.reduce((a, b) => (a < b ? a : b), 0),
    description: ["sum(n1, n2, ...)", "n1, n2, ...の最小値"],
  },
};
