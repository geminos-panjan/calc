import { ASTNodeState } from "./parsing_syntax.js";
import { tokenParsers } from "../token.js";
import { NullSet, createNulls } from "./null_set.js";
import { ParsingRule, isNonterminal } from "./parsing_rule.js";

export class FirstSet extends Set<ASTNodeState> {}

/**
 * First集合マップ、Null集合をもとに状態リストのFirst集合を探索
 * @param states 状態リスト
 * @param firsts First集合マップ
 * @param nulls Null集合
 * @returns First集合
 */
const findFirst = (
  states: ASTNodeState[],
  firsts: Map<ASTNodeState, FirstSet>,
  nulls: NullSet
): FirstSet => {
  const first = new FirstSet();
  for (const s of states) {
    firsts.get(s)?.forEach((s) => first.add(s));
    // nullableでなければ終わる
    if (!nulls.has(s)) {
      break;
    }
  }
  return first;
};

/**
 * 状態に対応したFirst集合のマップを作成
 * @param parsingRules 解析ルールリスト
 * @param nulls Null集合
 * @returns First集合リスト
 */
export const createFirsts = (
  parsingRules: ParsingRule[],
  nulls: NullSet
): Map<ASTNodeState, FirstSet> => {
  const firsts = new Map<ASTNodeState, FirstSet>();
  // 解析ルールリストを走査してFirstを探索
  for (const rule of parsingRules) {
    const first = new FirstSet();
    for (const pattern of rule.patterns) {
      const terminals = pattern.states.filter((s) => !isNonterminal(s));
      terminals.forEach((s) => firsts.set(s, new FirstSet([s])));
      if (pattern.states[0] !== undefined) {
        first.add(pattern.states[0]);
      }
    }
    // 再帰構造にならないようにする
    first.delete(rule.state);
    firsts.set(rule.state, first);
  }
  // 各First集合に非終端記号があれば展開する
  let hasNonterminal = true;
  while (hasNonterminal) {
    hasNonterminal = false;
    for (const [state, first] of firsts) {
      const nonterms = [...first].filter((s) => isNonterminal(s));
      hasNonterminal = nonterms.length > 0;
      const newFirst = first;
      for (const n of nonterms) {
        const f = firsts.get(n);
        if (f !== undefined) {
          newFirst.delete(n);
          f.forEach((s) => newFirst.add(s));
        }
      }
      firsts.set(state, newFirst);
    }
  }
  return firsts;
};

/**
 * First集合マップクラス
 */
export class FirstMap extends Map<ASTNodeState, FirstSet> {
  nulls: NullSet;

  constructor(parsingRules: ParsingRule[]) {
    const nulls = createNulls(parsingRules);
    super(createFirsts(parsingRules, nulls));
    this.nulls = nulls;
  }

  /**
   * 状態リストのFirst集合を探索
   * @param states 状態リスト
   * @returns First集合
   */
  find = (states: ASTNodeState[]): FirstSet =>
    findFirst(states, this, this.nulls);
}
