const divisible = (a: number, b: number) => {
  if (a < 2 || b < 2) {
    return false;
  }
  return a % b === 0;
};

const divAll = (factors: { [key: string]: number }, a: number, b: number) => {
  if (!divisible(a, b)) {
    return a;
  }
  factors[b] = 0;
  while (a > 1 && divisible(a, b)) {
    a = Math.floor(a / b);
    factors[b]++;
  }
  return a;
};

const PrimeFactors = (factors: { [key: string]: number }, n: number) => {
  if (n < 2) {
    return;
  }
  n = divAll(factors, n, 2);
  if (n < 2) {
    return;
  }
  n = divAll(factors, n, 3);
  if (n < 2) {
    return;
  }
  let even = true;
  for (
    let div = 5;
    1 < n && div <= Math.sqrt(n);
    div += (even = !even) ? 4 : 2
  ) {
    n = divAll(factors, n, div);
  }
  if (n > 1) {
    factors[n] = 1;
  }
};

export const PrimeFactorFormula = (num: number) => {
  if (num < 2) {
    return "";
  }
  const factors: { [key: string]: number } = {};
  PrimeFactors(factors, num);
  let out = "";
  if (Object.keys(factors).length < 1) {
    out += `${num}`;
    return out;
  }
  const keys = Object.keys(factors);
  for (let i = 0; i < keys.length; i++) {
    out += `${keys[i]}`;
    if (factors[keys[i]] > 1) {
      out += ` ^ ${factors[keys[i]]}`;
    }
    if (i < keys.length - 1) {
      out += " * ";
    }
  }
  return out;
};
