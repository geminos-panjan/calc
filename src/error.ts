import { Color as c, ResetEsc, TextColorEsc } from "./escape.js";
import { Node } from "./syntax_tree.js";
import { Token } from "./token.js";

const ErrorPos = (pos: number) => {
  return " ".repeat(pos + 2) + "^\n";
};

const CalcError = (msg: string, pos: number, value: string = "") => {
  let errMsg = "Error: " + msg;
  if (value !== "") {
    errMsg += ` "${value}"`;
  }
  return Error(errMsg);
};

export const UnexpectedEndError = (pos: number) => {
  return CalcError("Unexpected End", pos);
};

export const UnexpectedTokenError = (t: Token) => {
  return CalcError("Unexpected Token", t.start, t.value);
};

export const NotClosedPareError = (pos: number) => {
  return CalcError("Not Closed Parentheses", pos);
};

export const ZeroDivisionError = (pos: number) => {
  return CalcError("Zero Division", pos);
};

export const InvalidTokenError = (str: string, pos: number) => {
  return CalcError("Invalid Token", pos, str);
};

export const NotEnoughArgsError = (pos: number) => {
  return CalcError("Not Enough Arguments", pos);
};

export const InvalidArgsError = (nodes: Node[]) => {
  return CalcError(
    "Invalid Arguments",
    nodes[0].start,
    nodes.map((n) => n.formula).join('", "')
  );
};

export class Info extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
