import { CalcFunction } from "../calc_func.js";
import { parseNumList } from "../calc_func.js";

export type ReductionFunctionKey = "sum" | "mean" | "max" | "min";

export const reduceFuncs: { [key in ReductionFunctionKey]: CalcFunction } = {
  sum: {
    func: (n) => parseNumList(n).reduce((a, b) => a + b, 0),
    description: ["sum(n1, n2, ...) n1, n2, ...の合計"],
  },
  mean: {
    func: (n) => {
      const nums = parseNumList(n);
      return nums.length === 0
        ? 0
        : nums.reduce((a, b) => a + b, 0) / nums.length;
    },

    description: ["mean(n1, n2, ...) n1, n2, ...の平均"],
  },
  max: {
    func: (n) => parseNumList(n).reduce((a, b) => (a < b ? b : a), -Infinity),

    description: ["max(n1, n2, ...) n1, n2, ...の最大値"],
  },
  min: {
    func: (n) => parseNumList(n).reduce((a, b) => (a < b ? a : b), Infinity),

    description: ["min(n1, n2, ...) n1, n2, ...の最小値"],
  },
};
