import { InvalidArgsError } from "../../error.js";
import { CalcFunction, mapNumList } from "../calc_func.js";
import { hsl2rgb, rgb2hsl } from "./color.js";

export type ColorFuctionKey = "rgb2hsl" | "hsl2rgb";

export const colorFuncs: { [key in ColorFuctionKey]: CalcFunction } = {
  rgb2hsl: {
    funcs: {
      1: (n: any) => {
        if (isNaN(Number(n))) {
          throw new InvalidArgsError(`"${n}"`);
        }
        const r = (n >> 16) & 0xff;
        const g = (n >> 8) & 0xff;
        const b = (n >> 0) & 0xff;
        const hsl = rgb2hsl(r, g, b);
        return `hsl(${hsl.h}deg, ${hsl.s}%, ${hsl.l}%)`;
      },
      3: (r: any, g: any, b: any) => {
        const [nr, ng, nb] = mapNumList([r, g, b]);
        const hsl = rgb2hsl(nr, ng, nb);
        const h = Number.isInteger(hsl.h) ? hsl.h : hsl.h.toFixed(2);
        const s = Number.isInteger(hsl.s) ? hsl.s : hsl.s.toFixed(2);
        const l = Number.isInteger(hsl.l) ? hsl.l : hsl.l.toFixed(2);
        return `hsl(${h}deg, ${s}%, ${l}%)`;
      },
    },
    description: [
      "1. rgb2hsl(rgb) rgbをhslに変換",
      "2. rgb2hsl(r, g, b) r, g, bをhslに変換",
    ],
  },
  hsl2rgb: {
    funcs: {
      3: (h: any, l: any, s: any) => {
        const [nh, nl, ns] = mapNumList([h, l, s]);
        const rgb = hsl2rgb(nh, nl, ns);
        const r = Math.round(rgb.r).toString(16).padStart(2, "0");
        const g = Math.round(rgb.g).toString(16).padStart(2, "0");
        const b = Math.round(rgb.b).toString(16).padStart(2, "0");
        return "#" + r + g + b;
      },
    },
    description: ["hsl2rgb(h, s, l) h, s, lをrgbに変換"],
  },
};
