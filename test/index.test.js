import { calculate } from "../dist/index.js";

test.each([
  { exp: "2 * 3", res: "6" },
  { exp: "10 - 5 - 3", res: "2" },
  { exp: "2 * (1 + (5 - 3) * 4)", res: "18" },
  { exp: "-1", res: "-1" },
  { exp: "2 ^ 2 * pi", res: String(4 * Math.PI) },
  { exp: "-sum(1, 3, 2 * (6 - 4))", res: "-8" },
  { exp: "sum(-1, -3, 2 * -(6 - 4))", res: "-8" },
  {
    exp: "5 * pi / (-sum(1, 3, 2 * (6 - 4)))",
    res: String((5 * Math.PI) / -8),
  },
  { exp: "log(100) + log(16777216, 2)", res: "26" },
  { exp: "-(1+4)", res: "-5" },
  { exp: "255 % (2 ^ 8)", res: "255" },
  { exp: "0b101 + 0x0f", res: "20" },
  { exp: "3 * (1 + 2", res: "9" },
  { exp: "1 + 2) * 3", res: "9" },
  { exp: "prime(153)", res: "3 ^ 2 * 17" },
  { exp: "cvtbase(15, 8)", res: "(17)base8" },
  { exp: "hex(810)", res: "0x32A" },
  { exp: "bin(30) + hex(16)", res: "46" },
])(`$exp = $res`, ({ exp, res }) => {
  expect(calculate(exp)).toBe(res);
});
