import { InvalidArgsError } from "../../error.js";
import { CalcFunction, parseNum, parseString } from "../calc_func.js";
import { MyDate } from "./date.js";

export type DateFunctionKey = "date" | "time";

export const dateFuncs: { [key in DateFunctionKey]: CalcFunction } = {
  date: {
    funcs: {
      0: () => new MyDate().format("yyyy-MM-dd HH:mm:ss.SSS"),
      1: (n) => {
        const num = parseNum(n);
        const d = new MyDate(num);
        return d.format("yyyy-MM-dd HH:mm:ss.SSS");
      },
    },
    description: [
      '1. date() 現在の時間を"yyyy-MM-dd HH:mm:ss.SSS"形式で示す',
      '2. date(t) UNIX時間t[ミリ秒]から"yyyy-MM-dd HH:mm:ss.SSS"形式の時間に変換',
    ],
  },
  time: {
    funcs: {
      0: () => Date.now(),
      1: (s) => {
        const regex =
          /(\d{4})[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{2})?[^\d]*(\d{3})?/;
        const str = parseString(s);
        const m = regex.exec(str);
        if (m === null) {
          throw new InvalidArgsError(str);
        }
        const yyyy = Number(m[1] ?? 0);
        const MM = Number(m[2] ?? 1) - 1;
        const dd = Number(m[3] ?? 1);
        const HH = Number(m[4] ?? 0);
        const mm = Number(m[5] ?? 0);
        const ss = Number(m[6] ?? 0);
        const SSS = Number(m[7] ?? 0);
        const d = new Date(yyyy, MM, dd, HH, mm, ss, SSS);
        return d.getTime();
      },
    },
    description: [
      "1. time() 現在のUNIX時間[ミリ秒]",
      '2. time("t") "yyyyMMddHHmmssSSS"形式の時間tからUNIX時間[ミリ秒]に変換',
      '"2038年01月19日03時14分07秒"のように間に文字が入っていても可',
      "ただし0埋めは必要",
    ],
  },
};
