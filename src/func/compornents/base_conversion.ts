const CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

export const decimal = (nonDecimal: string, base: number) => {
  const nums: { [key: string]: number } = {};
  Array.from(CHARS).forEach((c, i) => (nums[c] = i));
  return Array.from(nonDecimal).reduce((p, c, i) => {
    if (isNaN(p)) {
      return NaN;
    }
    if (!(c in nums)) {
      return NaN;
    }
    return p + nums[c] * base ** (nonDecimal.length - 1 - i);
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
