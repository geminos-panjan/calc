import { bin, convertBase, hex } from "./base_conversion.js";
import { hsl2rgb, rgb2hsl } from "./color.js";
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
      if (n[1].value === 2) {
        return alters.bin.func(n);
      }
      if (n[1].value === 10) {
        return alters.dec.func(n);
      }
      if (n[1].value === 16) {
        return alters.hex.func(n);
      }
      if (n[1].value < 2 || 64 < n[1].value) {
        throw InvalidArgsError([n[1]]);
      }
      return (
        convertBase(n[0].value, n[1].value) + "(" + String(n[1].value + ")")
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
      return "0x" + hex(n[0].value);
    },
    description: ["hex(n)", "nを十六進数に変換"],
  },
  bin: {
    minNodes: 1,
    maxNodes: 1,
    func: (n) => {
      return "0b" + bin(n[0].value);
    },
    description: ["bin(n)", "nを二進数に変換"],
  },
  rgb2hsl: {
    minNodes: 1,
    maxNodes: 3,
    func: (n) => {
      if (n.length === 2) {
        throw InvalidArgsError(n);
      }
      let r = 0;
      let g = 0;
      let b = 0;
      if (n.length === 1) {
        r = (n[0].value >> 16) & 0xff;
        g = (n[0].value >> 8) & 0xff;
        b = (n[0].value >> 0) & 0xff;
      } else if (n.length === 3) {
        r = n[0].value;
        g = n[1].value;
        b = n[2].value;
      }
      const hsl = rgb2hsl(r, g, b);
      return `hsl(${hsl.h}deg, ${hsl.s}%, ${hsl.l}%)`;
    },
    description: [
      "1. rgb2hsl(rgb)",
      "rgbをhslに変換",
      "2. rgb2hsl(r, g, b)",
      "r, g, bをhslに変換",
    ],
  },
  hsl2rgb: {
    minNodes: 3,
    maxNodes: 3,
    func: (n) => {
      let h = n[0].value;
      let s = n[1].value;
      let l = n[2].value;
      const rgb = hsl2rgb(h, s, l);
      const r = hex(Math.floor(rgb.r));
      const g = hex(Math.floor(rgb.g));
      const b = hex(Math.floor(rgb.b));
      return "#" + r + g + b;
    },
    description: [
      "1. hsl2rgb(hsl)",
      "hslをrgbに変換",
      "2. hsl2rgb(h, s, l)",
      "h, s, lをrgbに変換",
    ],
  },
};
