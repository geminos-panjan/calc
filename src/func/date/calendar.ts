import { MyDate } from "./date.js";

/** 元号 */
type JapaneseEraName = {
  /** 元号名 */
  name: string;
  /** 開始日 */
  startedAt: Date;
  /** 終了日 */
  endedAt?: Date;
};

// グレゴリオ暦が適用されたのは明治6年1月1日(1873年1月1日)
// からなので明治5年以前は日付が一致しない
// 日本標準時が適用されたのは明治明治21年1月1日(1888年1月1日)
// からで、それ以前のタイムゾーンは+09:18:59に変換される
// 明治→大正、大正→昭和は本来終了日と開始日が重複しているが
// 簡略化のため日付を分けた

/** 元号テーブル */
const japaneseEraNames: JapaneseEraName[] = [
  {
    name: "明治",
    startedAt: new Date("1868-10-23T00:00:00.000+09:00"),
    endedAt: new Date("1912-07-29T23:59:59.999+09:00"),
  },
  {
    name: "大正",
    startedAt: new Date("1912-07-30T00:00:00.000+09:00"),
    endedAt: new Date("1926-12-24T23:59:59.999+09:00"),
  },
  {
    name: "昭和",
    startedAt: new Date("1926-12-25T00:00:00.000+09:00"),
    endedAt: new Date("1989-01-07T23:59:59.999+09:00"),
  },
  {
    name: "平成",
    startedAt: new Date("1989-01-08T00:00:00.000+09:00"),
    endedAt: new Date("2019-04-30T23:59:59.999+09:00"),
  },
  {
    name: "令和",
    startedAt: new Date("2019-05-01T00:00:00.000+09:00"),
    endedAt: undefined,
  },
];

/**
 * グレゴリオ暦文字列から和暦文字列に変換
 * @param str グレゴリオ暦文字列
 * @returns 和暦文字列
 */
export const calendarFromGregorianToJapanese = (
  str: string
): string | undefined => {
  const regex = /(\d{4})[^\d]*(\d{2})?[^\d]*(\d{2})?/;
  const m = regex.exec(str);
  if (m == undefined) {
    return undefined;
  }
  const yyyy = Number(m[1] ?? 0);
  const MM = Number(m[2] ?? 1) - 1;
  const dd = Number(m[3] ?? 1);
  const date = new MyDate(yyyy, MM, dd);
  if (
    japaneseEraNames[0] != undefined &&
    date.getTime() < japaneseEraNames[0].startedAt.getTime()
  ) {
    return date.format();
  }
  const eraName = [...japaneseEraNames]
    .reverse()
    .find((n) => n.startedAt.getTime() <= date.getTime());
  if (eraName == undefined) {
    return date.format();
  }
  const yearNum = date.getFullYear() - eraName.startedAt.getFullYear() + 1;
  const year = yearNum === 1 ? "元" : String(yearNum).padStart(2, "0");
  const eraYear = `${eraName.name}${year}年`;
  if (m[2] == undefined) {
    return date.format(eraYear);
  }
  if (m[3] == undefined) {
    return date.format(`${eraYear}${m[2]}月`);
  }
  return date.format(`${eraYear}${m[2]}月${m[3]}日`);
};

/**
 * 和暦文字列からグレゴリオ暦文字列に変換
 * @param date 和暦文字列
 * @returns グレゴリオ暦文字列
 */
export const calendarFromJapaneseToGregorian = (
  date: string
): string | undefined => {
  const regex =
    /(明治|大正|昭和|平成|令和)[^\d元]*(\d{2}|元)?[^\d]*(\d{2})?[^\d]*(\d{2})?/;
  const m = regex.exec(date);
  if (m == undefined) {
    return undefined;
  }
  const eraName = japaneseEraNames.find((n) => n.name === m[1]);
  if (eraName == undefined) {
    return undefined;
  }
  if (m[2] == undefined) {
    return String(eraName.startedAt.getFullYear());
  }
  const yyyy =
    (m[2] === "元" ? 1 : Number(m[2])) + eraName.startedAt.getFullYear() - 1;
  const d = new Date(yyyy, Number(m[3] ?? 1) - 1, Number(m[4] ?? 1));
  if (eraName.endedAt != undefined && eraName.endedAt.getTime() < d.getTime()) {
    return undefined;
  }
  if (m[3] == undefined) {
    return String(yyyy);
  }
  if (m[4] == undefined) {
    return `${yyyy}-${m[3]}`;
  }
  return `${yyyy}-${m[3]}-${m[4]}`;
};

// console.log(calendarFromJapaneseToGregorian("明治45年"));
// console.log(calendarFromJapaneseToGregorian("明治46年"));
// console.log(calendarFromJapaneseToGregorian("明治47年"));
// console.log(calendarFromGregorianToJapanese("1912-01-01"));
// console.log(calendarFromGregorianToJapanese("1913-01-01"));
// console.log(calendarFromGregorianToJapanese("1914-01-01"));
