const CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const NUMS = Array.from(CHARS).reduce<{ [key: string]: number }>((p, c, i) => {
  p[c] = i;
  return p;
}, {});

export const decimal = (nonDecimal: string, base: number) => {
  return Array.from(nonDecimal).reduce((p, c, i) => {
    if (isNaN(p)) {
      return NaN;
    }
    if (!(c in NUMS)) {
      return NaN;
    }
    return p + NUMS[c] * base ** (nonDecimal.length - 1 - i);
  }, 0);
};

export const convertBase = (
  num: number,
  base: number,
  nonDecimal: string = ""
): string => {
  if (num < 1) {
    return nonDecimal;
  }
  return convertBase(
    Math.floor(num / base),
    base,
    CHARS[num % base] + nonDecimal
  );
};

// const dec = decimal("0BF", 16);
// const hex = convertBase(dec, 16);
// console.log(dec);
// console.log(hex);
