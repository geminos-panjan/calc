import { ASTNodeState } from "./parsing_syntax.js";
import { getTokenSample } from "../token.js";
import { LRItem, echoLRItem } from "./lr_item.js";
import { createLRTable } from "./lr_table.js";
import { ParsingRule, isNonterminal } from "./parsing_rule.js";

export type ParsingOperation = "SHIFT" | "REDUCE" | "GOTO" | "ACCEPT";

export type ParsingTableCell = {
  operation: ParsingOperation;
  operand?: number;
  item?: LRItem;
};

export type ParsingTable = Map<ASTNodeState, ParsingTableCell[]>[];

const parsingOperations: { [key in ParsingOperation]: string } = {
  SHIFT: "s",
  REDUCE: "r",
  GOTO: "g",
  ACCEPT: "a",
};

export const echoParsingTableCell = (cell: ParsingTableCell) => {
  const operation = parsingOperations[cell.operation] + " ";
  const operand = (cell.operand ?? "") + " ";
  const item = (cell.item !== undefined ? echoLRItem(cell.item) : "") + " ";
  return `${operation}${operand}${item}`;
};

export const createParsingTable = (
  start: ASTNodeState,
  parsingRules: ParsingRule[]
): ParsingTable => {
  const lrTable = createLRTable(start, parsingRules);
  const table: ParsingTable = [];
  for (const row of lrTable) {
    const map = new Map<ASTNodeState, ParsingTableCell[]>();
    for (const edge of row.edges) {
      const state = edge.input;
      if (state === undefined) continue;
      const cells = map.get(state) ?? [];
      cells.push({
        operation: isNonterminal(state) ? "GOTO" : "SHIFT",
        operand: edge.target,
      });
      map.set(state, cells);
    }
    for (const item of row.items) {
      if (item.state === start && item.dot === item.pattern.states.length) {
        const cells = map.get("EOF") ?? [];
        cells.push({ operation: "ACCEPT" });
        map.set("EOF", cells);
      }
      for (const f of item.follow) {
        const cells = map.get(f) ?? [];
        cells.push({
          operation: "REDUCE",
          item,
        });
        map.set(f, cells);
      }
    }
    table.push(map);
  }
  return table;
};

export const echoParsingTable = (table: ParsingTable) => {
  const inputSet = new Set<ASTNodeState>();
  table.forEach((row) => row.forEach((_, k) => inputSet.add(k)));
  const inputs = [...inputSet].sort((a, b) => {
    const isNontermA = isNonterminal(a);
    const isNontermB = isNonterminal(b);
    if (isNontermA && !isNontermB) return 1;
    if (!isNontermA && isNontermB) return -1;
    return 0;
  });
  const cols = inputs.map((s) => (isNonterminal(s) ? s[0] : getTokenSample(s)));
  const tableRows = table.map((row) => Object.fromEntries(row));
  const rows = tableRows.map((row) =>
    inputs.map((s) => {
      const cells = row[s];
      if (cells?.[0] === undefined) return "";
      return `${parsingOperations[cells[0].operation]}${
        cells[0].operand ?? ""
      }${cells[0].item?.state[0] ?? ""}`;
    })
  );
  return `I\\T\t| ${cols.join("\t| ")}
-${cols
    .concat("")
    .map((_) => "-".repeat(7))
    .join("|")}
${rows.map((row, i) => `${i}\t| ${row.join("\t| ")}`).join("\n")}
`;
};
