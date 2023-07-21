import { ASTNodeState } from "./parsing_syntax.js";
import { getTokenSample } from "../token.js";
import { FirstMap } from "./first_map.js";
import { FollowSet } from "./follow_set.js";
import {
  LRItem,
  echoLRItem,
  isLRItemEqual,
  isLRItemEqualExceptFollow,
} from "./lr_item.js";
import { addLRItemList } from "./lr_item_list.js";
import { ParsingRule } from "./parsing_rule.js";

export type LRTableEdge = {
  input: ASTNodeState;
  target: number;
};

export type LRTableRow = {
  items: LRItem[];
  edges: LRTableEdge[];
};

export type LRTable = LRTableRow[];

const reduceLRTable = (table: LRTable) => {
  const reduced: LRTable = [];
  const indexMap = new Map<number, number>();
  const reducedSet = new Set<number>();
  table.forEach((row, rowIndex) => {
    if (reducedSet.has(rowIndex)) return;
    reducedSet.add(rowIndex);
    indexMap.set(rowIndex, reduced.length);
    const synonym: number[] = [];
    table.forEach((r, ri) => {
      if (reducedSet.has(ri)) return;
      const match = row.items.every((a, i) => {
        const b = r.items[i];
        if (b === undefined) return false;
        return isLRItemEqualExceptFollow(a, b);
      });
      if (match) {
        indexMap.set(ri, reduced.length);
        synonym.push(ri);
      }
    });
    const merged = row.items.map<LRItem>((item, i) => {
      const follow = new FollowSet(item.follow);
      for (const synItems of synonym) {
        table[synItems]?.items[i]?.follow.forEach((s) => follow.add(s));
      }
      return { ...item, follow };
    });
    reduced.push({ items: merged, edges: row.edges });
    synonym.forEach((n) => reducedSet.add(n));
  });
  return reduced.map<LRTableRow>((row) => {
    const edges = row.edges.map<LRTableEdge>((edge) => ({
      input: edge.input,
      target: indexMap.get(edge.target) ?? NaN,
    }));
    return { items: row.items, edges };
  });
};

/**
 * LRテーブルを作成する
 * @param state 開始状態
 * @param parsingRules 解析ルールリスト
 * @returns LRテーブル
 */
export const createLRTable = (
  state: ASTNodeState,
  parsingRules: ParsingRule[]
): LRTable => {
  // First集合を作成する
  const firsts = new FirstMap(parsingRules);
  const lrTable: LRTable = [];
  // 開始状態のFollow集合にEOFを持たせてLRアイテムリストを初期化する
  const rule = parsingRules.find((r) => r.state === state);
  if (rule === undefined || rule.patterns[0] === undefined) return lrTable;
  const unparsed: LRTableRow[] = [
    {
      items: addLRItemList(
        [
          {
            state,
            dot: 0,
            follow: new FollowSet(["EOF"]),
            pattern: rule.patterns[0],
          },
        ],
        firsts
      ),
      edges: [],
    },
  ];
  // キューが空になるまでLRテーブルに行を追加する
  while (unparsed.length > 0) {
    const row = unparsed.shift();
    if (row === undefined) break;
    const newItemsMap = new Map<ASTNodeState, LRItem[]>();
    // LRアイテムをドット位置の状態ごとに分類する
    for (const item of row.items) {
      // ドット位置が状態リストの最後ならそれ以上解析しない
      const state = item.pattern.states[item.dot] ?? "EOF";
      if (state === "EOF") continue;
      const newItems = newItemsMap.get(state) ?? [];
      // ドットを進める
      newItems.push({ ...item, dot: item.dot + 1 });
      newItemsMap.set(state, newItems);
    }
    // 分類したLRアイテムリストをそれぞれキューに追加する
    for (const [state, items] of newItemsMap) {
      // LRアイテムを追加する
      const newItems = addLRItemList(items, firsts);
      // 作成したLRアイテムリストがLRテーブル、解析中の行、キューのいずれかに存在したらキューには追加しない
      const table = lrTable.concat(row, unparsed);
      const exsisting = table.findIndex((row) =>
        row.items.every((a, i) => {
          const b = newItems[i];
          if (b === undefined) return false;
          return isLRItemEqual(a, b);
        })
      );
      // 解析中の行をターゲットに接続する
      if (exsisting !== -1) {
        row.edges.push({
          input: state,
          target: exsisting,
        });
        continue;
      }
      row.edges.push({
        input: state,
        target: lrTable.length + unparsed.length + 1,
      });
      // キューに追加する
      unparsed.push({
        items: newItems,
        edges: [],
      });
      continue;
    }
    lrTable.push(row);
  }
  return reduceLRTable(lrTable);
};

const htmlEscape = (text: string) => {
  return text.replace(
    /["'{}<>|]/g,
    (s) => `&#x${s.codePointAt(0)?.toString(16)};`
  );
};

export const echoLRTable = (table: LRTable): string => {
  const labels = table
    .map(
      (row, i) =>
        `I${i} [ label = "{I${i}|${row.items
          .map((item) => htmlEscape(echoLRItem(item)))
          .join("|")}}" ];`
    )
    .join("\n  ");
  const nodes = table
    .map((row, i) =>
      row.edges
        .map(
          (edge) =>
            `I${i} -> I${edge.target} [ label = "${htmlEscape(
              getTokenSample(edge.input)
            )}" ];`
        )
        .join("\n  ")
    )
    .filter((s) => s !== "")
    .join("\n  ");
  return `digraph LRTable {
  node [
    fontname = "Consolas, Meiryo",
    shape = record,
  ];
  edge [
    fontname = "Consolas, Meiryo",
  ];

  ${labels}

  ${nodes}
}
`;
};
