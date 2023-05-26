const CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

export const decimal = (num: string, base: number) => {
  const nums: { [char: string]: number } = {};
  for (let i = 0; i < base; i++) {
    nums[CHARS[i]] = i;
  }
  let dec = 0;
  const len = num.length;
  for (let i = 0; i < len; i++) {
    dec += nums[num[len - 1 - i]] * Math.pow(base, i);
  }
  return dec;
};

export const convertBase = (num: number, base: number) => {
  let outText = "";
  while (true) {
    const mod = num % base;
    outText = CHARS[mod] + outText;
    num = Math.floor(num / base);
    if (num < 1) break;
  }
  return outText;
};

export const hex = (num: number) => {
  const hex = convertBase(num, 16);
  return hex.padStart(Math.ceil(hex.length / 2) * 2, "0");
};

export const bin = (num: number) => {
  const bin = convertBase(num, 2);
  return bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
};
