import { constants } from "./constant.js";
import {
  UnexpectedTokenError,
  NotClosedPareError,
  InvalidTokenError,
  UnexpectedEndError,
  InvalidArgsError,
} from "./error.js";
import { funcs } from "./func.js";
import { addOpr, mulOpr, Operators as o, signOpr } from "./operator.js";
import {
  createTokenList,
  sliceFormula,
  Token,
  TokenType as tk,
} from "./token.js";
// import { dumpNodeDot, dumpTokenDot } from "../test/dot.js";

let g_tlPos = 0;
let g_tokenList: Token[] = [];

export type Node = {
  formula: string;
  value: number;
  start: number;
  end: number;
  children: Node[];
};

const createNode = (
  formula: string,
  value: number,
  start: number,
  end: number,
  children: Node[] = []
) => {
  return {
    formula: formula,
    value: value,
    start: start,
    end: end,
    children: children,
  } as Node;
};

const currentToken = () => {
  if (g_tokenList.length <= g_tlPos) {
    return false;
  }
  const t = g_tokenList[g_tlPos];
  return t;
};

const Num = () => {
  const t = currentToken();
  if (t === false || t.type !== tk.NUMBER) {
    return false;
  }
  g_tlPos++;
  const node = createNode(t.value, Number(t.value), t.start, t.end);
  return node;
};

const Constant = () => {
  let node = Num();
  if (node !== false) {
    return node;
  }
  let t = currentToken();
  if (t === false || t.type !== tk.CONSTANT) {
    return false;
  }
  g_tlPos++;
  const Constant = createNode(
    t.value,
    constants[t.value].value,
    t.start,
    t.end
  );
  return Constant;
};

const Func = () => {
  let node = Constant();
  if (node !== false) {
    return node;
  }
  let t = currentToken();
  if (t === false || t.type !== tk.FUNC) {
    return false;
  }
  const start = t.start;
  let end = t.end;
  const func = t.value;
  g_tlPos++;
  t = currentToken();
  if (t === false) {
    throw UnexpectedEndError(end);
  }
  if (t.value !== o.L_PARE) {
    throw UnexpectedTokenError(t);
  }
  g_tlPos++;
  end = t.end;
  const args: Node[] = [];
  let arg = {} as Node;
  while (true) {
    t = currentToken();
    if (t === false) {
      break;
    }
    if (t.value === o.R_PARE) {
      g_tlPos++;
      break;
    }
    if (t.value === o.COMMA) {
      g_tlPos++;
      continue;
    }
    arg = Adder();
    args.push(arg);
    end = arg.end;
  }
  const f = funcs[func];
  if (f.minNodes !== null && args.length < f.minNodes) {
    if (args.length < 1) {
      throw InvalidArgsError([createNode("", 0, start, end)]);
    }
    throw InvalidArgsError(args);
  }
  if (f.maxNodes !== null && f.maxNodes < args.length) {
    throw InvalidArgsError(args.slice(f.maxNodes));
  }
  const value = funcs[func].func(args);
  arg = createNode(sliceFormula(start, end), value, start, end, args);
  return arg;
};

const Pare = (): false | Node => {
  let node = Func();
  if (node !== false) {
    return node;
  }
  let t = currentToken();
  if (t === false || t.value !== o.L_PARE) {
    return false;
  }
  const start = t.start;
  g_tlPos++;
  const child = Adder();
  t = currentToken();
  g_tlPos++;
  if (t === false) {
    // throw NotClosedPareError(start);
    node = createNode(
      sliceFormula(start, child.end),
      child.value,
      start,
      child.end,
      [child]
    );
    return node;
  }
  if (t.value !== o.R_PARE) {
    throw UnexpectedTokenError(t);
  }
  node = createNode(sliceFormula(start, t.end), child.value, start, t.end, [
    child,
  ]);
  return node;
};

const Sign = () => {
  let node = Pare();
  if (node !== false) {
    return node;
  }
  let t = currentToken();
  if (t === false) {
    throw UnexpectedEndError(0);
  } else if (!(t.value in signOpr)) {
    throw UnexpectedTokenError(t);
  }
  const start = t.start;
  const end = t.end;
  const opr = t.value;
  g_tlPos++;
  node = Pare();
  if (node === false) {
    throw UnexpectedEndError(end);
  }
  const value = signOpr[opr](node);
  node = createNode(sliceFormula(start, node.end), value, start, node.end, [
    node,
  ]);
  return node;
};

const Factor = () => {
  let node = Sign();
  const start = node.start;
  while (true) {
    const t = currentToken();
    if (t === false || !(t.value in mulOpr)) {
      return node;
    }
    g_tlPos++;
    const child = Sign();
    const value = mulOpr[t.value](node, child);
    node = createNode(sliceFormula(start, child.end), value, start, child.end, [
      node,
      child,
    ]);
  }
};

const Adder = () => {
  let node = Factor();
  const start = node.start;
  while (true) {
    const t = currentToken();
    if (t === false || !(t.value in addOpr)) {
      return node;
    }
    g_tlPos++;
    const child = Factor();
    const value = addOpr[t.value](node, child);
    node = createNode(sliceFormula(start, child.end), value, start, child.end, [
      node,
      child,
    ]);
  }
};

const createSyntaxTree = () => {
  return Adder();
};

export const calculate = (str: string) => {
  g_tlPos = 0;
  let lpare = 0;
  let rpare = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === o.L_PARE) lpare++;
    if (c === o.R_PARE) rpare++;
  }
  if (lpare < rpare) {
    str = str.padStart(str.length + rpare - lpare, o.L_PARE);
  }
  const tl = createTokenList(str);
  g_tokenList = tl;
  if (tl.length < 1) {
    throw InvalidTokenError("", 0);
  }
  const node = createSyntaxTree();
  if (g_tlPos < g_tokenList.length) {
    throw UnexpectedTokenError(tl[tl.length - 1]);
  }
  // dumpTokenDot(tl);
  // dumpNodeDot(node);
  // console.log(node);
  // console.log(node.formula);
  return node.value;
};
