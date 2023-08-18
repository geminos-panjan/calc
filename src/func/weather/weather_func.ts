import { InvalidArgsError } from "../../error.js";
import { CalcFunction, parseNum, parseString } from "../calc_func.js";
import { TempUnit, ZERO_K, convertTemperature } from "./temperature.js";

export type WeatherFunctionKey = "temper" | "C2F" | "C2K" | "F2C" | "K2C";

export const weatherFuncs: { [key in WeatherFunctionKey]: CalcFunction } = {
  temper: {
    funcs: {
      2: (n, from) => {
        const num = parseNum(n);
        const fromUnit = parseString(from);
        const temper = convertTemperature(num, fromUnit as TempUnit, "C");
        if (temper === undefined) {
          throw new InvalidArgsError(
            'temper(n, "from") Invalid Temperature Unit'
          );
        }
        return temper;
      },
      3: (n, from, to) => {
        const num = parseNum(n);
        const fromUnit = parseString(from);
        const toUnit = parseString(to);
        const temper = convertTemperature(
          num,
          fromUnit as TempUnit,
          toUnit as TempUnit
        );
        if (temper === undefined) {
          throw new InvalidArgsError(
            'temper(n, "from", "to") Invalid Temperature Unit'
          );
        }
        return temper;
      },
    },
    description: [
      '1. temper(n, "from") nを温度単位fromからセルシウス温度に変換',
      '2. temper(n, "from", "to") nを温度単位fromから温度単位toに変換',
      "温度単位はC(摂氏), F(華氏), K(絶対温度)に対応",
    ],
  },
  C2F: {
    funcs: {
      1: (n) => parseNum(n) * 1.8 + 32,
    },
    description: ["C2F(n) °C → °F"],
  },
  C2K: {
    funcs: {
      1: (n) => parseNum(n) - ZERO_K,
    },
    description: ["C2K(n) °C → K"],
  },
  F2C: {
    funcs: {
      1: (n) => (parseNum(n) - 32) / 1.8,
    },
    description: ["F2C(n) °F → °C"],
  },
  K2C: {
    funcs: {
      1: (n) => parseNum(n) + ZERO_K,
    },
    description: ["K2C(n) K → °C"],
  },
};
