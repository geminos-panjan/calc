import { ZeroDivisionError } from "./error.js";
import { Node } from "./syntax_tree.js";

export const Operators = Object.freeze({
  ADD: "+",
  SUB: "-",
  MUL: "*",
  DIV: "/",
  MOD: "%",
  POW: "^",
  L_PARE: "(",
  R_PARE: ")",
  PLUS: "+",
  MINUS: "-",
  COMMA: ",",
});

const o = Operators;

export const addOpr: { [key: string]: (a: Node, b: Node) => number } = {};
addOpr[o.ADD] = (a, b) => a.value + b.value;
addOpr[o.SUB] = (a, b) => a.value - b.value;

export const mulOpr: { [key: string]: (a: Node, b: Node) => number } = {};
mulOpr[o.MUL] = (a, b) => a.value * b.value;
mulOpr[o.DIV] = (a, b) => {
  if (b.value === 0) {
    throw ZeroDivisionError(b.start);
  } else {
    return a.value / b.value;
  }
};
mulOpr[o.MOD] = (a, b) => {
  if (b.value === 0) {
    throw ZeroDivisionError(b.start);
  } else {
    return a.value % b.value;
  }
};
mulOpr[o.POW] = (a, b) => Math.pow(a.value, b.value);

export const signOpr: { [key: string]: (a: Node) => number } = {};
signOpr[o.PLUS] = (a) => a.value;
signOpr[o.MINUS] = (a) => -a.value;
