export type TempUnit = "C" | "F" | "K";

// 温度変換
// セルシウス温度を基本とする

/** 絶対零度 */
export const ZERO_K = -273.15;

type TempConverter = {
  /** セルシウス温度からの変換関数 */
  from: (n: number) => number;
  /** セルシウス温度への変換関数 */
  to: (n: number) => number;
};

const tempUnits = new Map<TempUnit, TempConverter>([
  [
    "C",
    {
      from: (n) => n,
      to: (n) => n,
    },
  ],
  [
    "F",
    {
      from: (n) => (n - 32) / 1.8,
      to: (n) => n * 1.8 + 32,
    },
  ],
  [
    "K",
    {
      from: (n) => n + ZERO_K,
      to: (n) => n - ZERO_K,
    },
  ],
]);

export const convertTemperature = (
  n: number,
  from: TempUnit,
  to: TempUnit
): number | undefined => {
  const cvtFrom = tempUnits.get(from);
  if (cvtFrom === undefined) return undefined;
  const cvtTo = tempUnits.get(to);
  if (cvtTo === undefined) return undefined;
  // fromの単位からセルシウス温度に変換してtoの単位にする
  return cvtTo.to(cvtFrom.from(n));
};
