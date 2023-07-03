export const termOperators: {
  [key: string]: (a: number, b: number) => number;
} = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
};

export const factorOperators: {
  [key: string]: (a: number, b: number) => number;
} = {
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a, b) => a % b,
};

export const exponentOperator: {
  [key: string]: (a: number, b: number) => number;
} = {
  "**": (a, b) => a ** b,
};

export const signOperators: { [key: string]: (n: number) => number } = {
  "+": (n) => n,
  "-": (n) => -n,
  "~": (n) => ~n >>> 0,
};

export const bitwiseOperator: {
  [key: string]: (a: number, b: number) => number;
} = {
  "&": (a, b) => a & b,
  "^": (a, b) => a ^ b,
  "|": (a, b) => a | b,
};
