/**
 * aがbで割り切れるか
 * @param a 被除数
 * @param b 除数
 * @returns 割り切れるか
 */
const isDivisible = (a: number, b: number) => {
  if (a < 2 || b < 2) {
    return false;
  }
  return a % b === 0;
};

/**
 * aを割り切れるまでbで割る
 * @param a 被除数
 * @param b 除数
 * @returns 割り切った商と割った回数
 */
const divRec = (a: number, b: number): { quotient: number; depth: number } => {
  let quotient = a;
  let depth = 0;
  while (quotient > 1 && isDivisible(quotient, b)) {
    quotient /= b;
    depth++;
  }
  return { quotient, depth };
};

/**
 * 素因数分解
 * @param n 素因数分解する数
 * @returns 素数と、その素数をかける回数のMap
 */
const primeFactorize = (n: number): Map<number, number> => {
  const primes = new Map<number, number>();
  // 2で割り切っておく
  if (isDivisible(n, 2)) {
    const div = divRec(n, 2);
    n = div.quotient;
    primes.set(2, div.depth);
  }
  let divisor = 3;
  while (true) {
    const maxDivisor = Math.sqrt(n);
    // 除数が被除数の平方根以上ならばbreak
    if (divisor >= maxDivisor) {
      // nが1以上ならば素数に追加
      if (n > 1) {
        primes.set(n, 1);
      }
      break;
    }
    // 除数で割り切れなければcontinue
    if (!isDivisible(n, divisor)) {
      divisor += 2;
      continue;
    }
    const div = divRec(n, divisor);
    primes.set(divisor, div.depth);
    // 割り切れればbreak
    if (div.quotient <= 1) {
      break;
    }
    n = div.quotient;
    divisor += 2;
  }
  return primes;
};

export const expressPrimeFactors = (num: number) => {
  const primes = primeFactorize(num);
  if (primes.size < 1) {
    return String(num);
  }
  return [...primes]
    .map(([k, v]) => String(k) + (v > 1 ? ` ** ${v}` : ""))
    .join(" * ");
};

// console.log(expressPrimeFactors(9991));
// console.log(expressPrimeFactors(732));
// console.log(expressPrimeFactors(128));
// console.log(expressPrimeFactors(2623561561));
