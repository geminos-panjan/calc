export const gcd = (a: number, b: number): number => {
  const r = a >= b ? a % b : b % a;
  if (r == 0) {
    return a >= b ? b : a;
  }
  return gcd(b, r);
};
