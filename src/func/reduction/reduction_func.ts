import { CalcFunction } from "../calc_func.js";
import { mapNumList } from "../calc_func.js";

export type ReductionFunctionKey = "sum" | "mean" | "max" | "min";

export const reduceFuncs: { [key in ReductionFunctionKey]: CalcFunction } = {
  sum: {
    func: (...n: any[]) => mapNumList(n).reduce((a, b) => a + b, 0),
    description: ["sum(n1, n2, ...) n1, n2, ...の合計"],
  },
  mean: {
    func: (...n: any[]) =>
      n.length === 0 ? 0 : mapNumList(n).reduce((a, b) => a + b, 0) / n.length,
    description: ["mean(n1, n2, ...) n1, n2, ...の平均"],
  },
  max: {
    func: (...n: any[]) => mapNumList(n).reduce((a, b) => (a < b ? b : a), 0),
    description: ["max(n1, n2, ...) n1, n2, ...の最大値"],
  },
  min: {
    func: (...n: any[]) =>
      mapNumList(n).reduce((a, b) => (a < b ? a : b), Infinity),
    description: ["min(n1, n2, ...) n1, n2, ...の最小値"],
  },
};
