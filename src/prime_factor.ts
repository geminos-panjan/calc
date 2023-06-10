const isDivisible = (a: number, b: number) => {
  if (a < 2 || b < 2) {
    return false;
  }
  return a % b === 0;
};

const divRec = (
  a: number,
  b: number,
  d: number = 0
): { quotient: number; depth: number } => {
  if (!isDivisible(a, b)) {
    return { quotient: a, depth: d };
  }
  return divRec(a / b, b, d + 1);
};

const createDivisorList = (start: number, end: number) => {
  const max = Math.sqrt(end);
  const len = Math.floor((max - (max % 3)) / 2);
  const divisors = new Array(len).fill(0).map((_, i) => 3 + i * 2);
  return [2, ...divisors].filter((d) => d >= start);
};

const primeFactorize = (
  n: number,
  start: number = 2,
  primes: { [key: string]: number } = {}
): { [key: string]: number } => {
  const divisors = createDivisorList(start, n);
  if (divisors.length === 0) {
    primes[String(n)] = 1;
    return primes;
  }
  if (!isDivisible(n, divisors[0])) {
    if (divisors.length === 1) {
      primes[String(n)] = 1;
      return primes;
    }
    return primeFactorize(n, divisors[1], primes);
  }
  const div = divRec(n, divisors[0]);
  primes[String(divisors[0])] = div.depth;
  if (div.quotient === 1) {
    return primes;
  }
  return primeFactorize(div.quotient, divisors[1], primes);
};

export const expressPrimeFactors = (num: number) => {
  const primes = primeFactorize(num);
  const keys = Object.keys(primes);
  if (keys.length < 1) {
    return String(num);
  }
  return keys
    .map((k) => String(k) + (primes[k] > 1 ? ` ^ ${primes[k]}` : ""))
    .join(" * ");
};

// console.log(expressPrimeFactors(9991));
// console.log(expressPrimeFactors(732));
// console.log(expressPrimeFactors(128));
// console.log(expressPrimeFactors(1000));
