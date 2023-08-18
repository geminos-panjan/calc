import { InvalidArgsError } from "../../error.js";
import { CalcFunction, parseNum, parseString } from "../calc_func.js";
import {
  calendarFromJapaneseToGregorian,
  calendarFromGregorianToJapanese,
} from "./calendar.js";
import { MyDate, parseTime } from "./date.js";

export type DateFunctionKey =
  | "date"
  | "time"
  | "now"
  | "calendar_j2g"
  | "calendar_g2j";

export const dateFuncs: { [key in DateFunctionKey]: CalcFunction } = {
  date: {
    funcs: {
      0: () => new MyDate().format(),
      1: (n) => {
        const num = parseNum(n);
        const d = new MyDate(num);
        return d.format();
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
        const str = parseString(s);
        return parseTime(str);
      },
    },
    description: [
      "1. time() 現在のUNIX時間[ミリ秒]",
      '2. time("t") "y-M-d H:m:s.S"形式の時間tからUNIX時間[ミリ秒]に変換',
      "-, :, .は別の文字でも可",
    ],
  },
  now: {
    funcs: {
      0: () => Date.now(),
    },
    description: ["now() time()のエイリアス"],
  },
  calendar_j2g: {
    funcs: {
      1: (s) => {
        const str = parseString(s);
        const calendar = calendarFromJapaneseToGregorian(str);
        if (calendar == undefined) {
          throw new InvalidArgsError(`calendar_j2g("s") Invalid date`);
        }
        return calendar;
      },
    },
    description: [
      'calendar_j2g("s") "年号y年M月d日"形式の日付sからグレゴリオ暦の日付に変換',
      "年, 月, 日は別の文字でも可",
    ],
  },
  calendar_g2j: {
    funcs: {
      1: (s) => {
        const str = parseString(s);
        const calendar = calendarFromGregorianToJapanese(str);
        if (calendar == undefined) {
          throw new InvalidArgsError(`calendar_g2j("s") Invalid date`);
        }
        return calendar;
      },
    },
    description: [
      'calendar_g2j("s") "y-M-d"形式の日付sから和暦の日付に変換',
      "-は別の文字でも可",
    ],
  },
};
