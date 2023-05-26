import { convertBase } from "./base_conversion.js";
import { InvalidArgsError } from "./error.js";
import { PrimeFactorFormula } from "./prime_factor.js";
import { Node } from "./syntax_tree.js";

type Alter = {
  minNodes: number;
  maxNodes: number;
  func: (n: Node[]) => string;
  description: string[];
};

export const alters: { [key: string]: Alter } = {
  prime: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      if (n[0].value < 2) {
        throw InvalidArgsError(n);
      }
      return PrimeFactorFormula(n[0].value);
    },
    description: ["prime(n)", "nの素因数分解"],
  },
  cvtbase: {
    minNodes: 2,
    maxNodes: 2,
    func: (n) => {
      return (
        "(" + convertBase(n[0].value, n[1].value) + ")base" + String(n[1].value)
      );
    },
    description: ["cvtbase(n, m)", "nをm進数に変換"],
  },
  dec: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      return String(n[0].value);
    },
    description: ["dec(n)", "nを十進数に変換"],
  },
  hex: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      return "0x" + convertBase(n[0].value, 16);
    },
    description: ["hex(n)", "nを十六進数に変換"],
  },
  bin: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      const bin = convertBase(n[0].value, 2);
      return "0b" + bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
    },
    description: ["bin(n)", "nを二進数に変換"],
  },
};
