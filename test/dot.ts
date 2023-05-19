import { writeFileSync } from "fs";
import { Node } from "../src/syntax_tree.js";
import { Token } from "../src/token.js";

const getNodeInfo = (node: Node) => {
  let info = "";
  if (node.formula !== "") {
    info += node.formula + " ";
  }
  info += String(node.value);
  return info;
};

const diveNode = (text: string, node: Node) => {
  if (node.children.length < 1) {
    return text;
  }
  const info = getNodeInfo(node);
  for (const c of node.children) {
    const info1 = getNodeInfo(c);
    text += `  "${info}" -> "${info1}"\n`;
    text += diveNode("", c);
  }
  return text;
};

export const dumpTokenDot = (tl: Token[]) => {
  let text = "";
  let last = "";
  for (const t of tl) {
    text += `  "${t.value}" -> "${last}"\n`;
    last = t.value;
  }
  writeFileSync("test/dump.dot", `digraph G {\n${text}}\n`);
};

export const dumpNodeDot = (node: Node) => {
  let text = diveNode("", node);
  if (text === "") {
    text += `  "${getNodeInfo(node)}"\n`;
  }
  writeFileSync("test/dump.dot", `digraph G {\n${text}}\n`);
  // const text = JSON.stringify(node);
  // writeFileSync("test/dump.json", `diagraph G {\n${text}}\n`);
};
