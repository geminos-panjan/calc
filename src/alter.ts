import { convertBase } from "./base_conversion.js";
import { hsl2rgb, rgb2hsl } from "./color.js";
import { InvalidArgsError } from "./error.js";
import { expressPrimeFactors } from "./prime_factor.js";

type Alter = {
  funcs: { args: number; func: (n: number[]) => string }[];
  description: string[];
};

export const alters: { [key: string]: Alter } = {
  prime: {
    funcs: [
      {
        args: 1,
        func: (n) => {
          if (n[0] < 2) {
          }
          return expressPrimeFactors(n[0]);
        },
      },
    ],
    description: ["prime(n)", "nの素因数分解"],
  },
  cvtbase: {
    funcs: [
      {
        args: 2,
        func: (n) => {
          if (n[1] === 2) {
            return alters.bin.funcs[0].func(n);
          }
          if (n[1] === 10) {
            return alters.dec.funcs[0].func(n);
          }
          if (n[1] === 16) {
            return alters.hex.funcs[0].func(n);
          }
          if (n[1] < 2 || 64 < n[1]) {
            throw new InvalidArgsError("cvtbase(n), 2 <= n <= 64");
          }
          return convertBase(n[0], n[1]) + "(" + String(n[1] + ")");
        },
      },
    ],
    description: ["cvtbase(n, m)", "nをm進数に変換"],
  },
  dec: {
    funcs: [
      {
        args: 1,
        func: (n) => {
          return String(n[0]);
        },
      },
    ],
    description: ["dec(n)", "nを十進数に変換"],
  },
  hex: {
    funcs: [
      {
        args: 1,
        func: (n) => {
          return "0x" + n[0].toString(16);
        },
      },
    ],
    description: ["hex(n)", "nを十六進数に変換"],
  },
  bin: {
    funcs: [
      {
        args: 1,
        func: (n) => {
          return "0b" + n[0].toString(2);
        },
      },
    ],
    description: ["bin(n)", "nを二進数に変換"],
  },
  rgb2hsl: {
    funcs: [
      {
        args: 1,
        func: (n) => {
          const r = (n[0] >> 16) & 0xff;
          const g = (n[0] >> 8) & 0xff;
          const b = (n[0] >> 0) & 0xff;
          const hsl = rgb2hsl(r, g, b);
          return `hsl(${hsl.h}deg, ${hsl.s}%, ${hsl.l}%)`;
        },
      },
      {
        args: 3,
        func: (n) => {
          const hsl = rgb2hsl(n[0], n[1], n[2]);
          return `hsl(${hsl.h}deg, ${hsl.s}%, ${hsl.l}%)`;
        },
      },
    ],
    description: [
      "1. rgb2hsl(rgb)",
      "rgbをhslに変換",
      "2. rgb2hsl(r, g, b)",
      "r, g, bをhslに変換",
    ],
  },
  hsl2rgb: {
    funcs: [
      {
        args: 3,
        func: (n) => {
          const rgb = hsl2rgb(n[0], n[1], n[2]);
          const r = Math.floor(rgb.r).toString(16);
          const g = Math.floor(rgb.g).toString(16);
          const b = Math.floor(rgb.b).toString(16);
          return "#" + r + g + b;
        },
      },
    ],
    description: [
      "1. hsl2rgb(hsl)",
      "hslをrgbに変換",
      "2. hsl2rgb(h, s, l)",
      "h, s, lをrgbに変換",
    ],
  },
};
