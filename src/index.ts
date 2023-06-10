import { createSyntaxTree } from "./syntax_tree.js";
import { constants } from "./constant.js";
import { alters } from "./alter.js";
import { funcs } from "./func.js";
import { createTokenList } from "./token.js";

const calculate = (text: string) => {
  const tokens = createTokenList(text);
  const node = createSyntaxTree(tokens);
  return node.text;
};

export { calculate, constants, alters, funcs, createTokenList };

// console.log(calculate("2 * 3"));
// console.log(calculate("10 - 5 - 3"));
// console.log(calculate("2 * (1 + (5 - 3) * 4)"));
// console.log(calculate("-1"));
// console.log(calculate("2 ^ 2 * pi"));
// console.log(calculate("-sum(1, 3, 2 * (6 - 4))"));
// console.log(calculate("sum(-1, -3, 2 * -(6 - 4))"));
// console.log(calculate("5 * pi / (-sum(1, 3, 2 * (6 - 4)))"));
// console.log(calculate("log(100) + log(16777216, 2)"));
// console.log(calculate("-(1+4)"));
// console.log(calculate("255 % (2 ^ 8)"));
// console.log(calculate("0b101 + 0x0f"));
// console.log(calculate("3 * (1 + 2"));
// console.log(calculate("1 + 2) * 3"));
// console.log(calculate("prime(153)"));
// console.log(calculate("cvtbase(15, 8)"));
// console.log(calculate("hex(810)"));
// console.log(calculate("bin(30) + hex(16)"));
// console.log(calculate("22pi/22"));
