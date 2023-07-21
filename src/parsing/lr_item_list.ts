import { ASTNodeState } from "./parsing_syntax.js";
import { FirstMap } from "./first_map.js";
import { FollowMap, FollowSet } from "./follow_set.js";
import { LRItem } from "./lr_item.js";
import { isNonterminal, parsingRuleMap } from "./parsing_rule.js";

/**
 * LRアイテムリストを作成
 * @param initItems 初期LRアイテムリスト
 * @param firsts First集合マップ
 * @returns LRアイテムリスト
 */
export const addLRItemList = (
  initItems: LRItem[],
  firsts: FirstMap
): LRItem[] => {
  const parsed = new Set<ASTNodeState>();
  const unparsed: LRItem[] = initItems;
  const items: LRItem[] = [];
  const follows = new FollowMap();
  for (const item of initItems) {
    const follow = follows.get(item.state) ?? new FollowSet();
    item.follow.forEach((s) => follow.add(s));
    follows.set(item.state, follow);
    const childFirst = item.pattern.states[item.dot];
    if (childFirst !== undefined && isNonterminal(childFirst)) {
      const childStates = item.pattern.states.slice(item.dot + 1);
      const childFollow = follows.get(childFirst) ?? new FollowSet();
      firsts.find(childStates).forEach((s) => childFollow.add(s));
      if (childStates.length === 0) {
        childFollow.add(item.state);
      }
      follows.set(childFirst, childFollow);
    }
  }
  // キューが空になるまで繰り返す
  while (unparsed.length > 0) {
    const item = unparsed.shift();
    if (item === undefined) break;
    items.push(item);
    const dotState = item.pattern.states[item.dot];
    if (dotState === undefined) continue;
    if (parsed.has(dotState)) continue;
    parsed.add(dotState);
    const rule = parsingRuleMap.get(dotState);
    if (rule === undefined) continue;
    // LRアイテムを作成してリストにpush
    for (const pattern of rule.patterns) {
      const follow = follows.get(dotState) ?? new FollowSet();
      // ドット位置+1以降のFirst集合
      const parentStates = item.pattern.states.slice(item.dot + 1);
      const first = firsts.find(parentStates);
      // ドット位置+1以降がすべてnullableだった場合は左辺のFollow集合を引き継ぐ
      if (parentStates.every((s) => firsts.nulls.has(s))) {
        follow.add(item.state);
      }
      const childFirst = pattern.states[0];
      if (childFirst !== undefined && isNonterminal(childFirst)) {
        const childStates = pattern.states.slice(1);
        const childFollow = follows.get(childFirst) ?? new FollowSet();
        firsts.find(childStates).forEach((s) => childFollow.add(s));
        follows.set(childFirst, childFollow);
      }
      first.forEach((s) => follow.add(s));
      follows.set(dotState, follow);
      const newItem = {
        state: rule.state,
        dot: 0,
        follow: new FollowSet(follow),
        pattern,
      };
      unparsed.push(newItem);
    }
  }
  // Follow集合をセットしたLRアイテムリストを返す
  // return setFollows(items, firsts);
  // 非終端記号をすべて展開するまで繰り返す
  let hasNonterm = true;
  while (hasNonterm) {
    hasNonterm = false;
    for (const [state, follow] of follows) {
      for (const f of follow) {
        if (!isNonterminal(f)) continue;
        follow.delete(f);
        const nonterm = follows.get(f);
        if (nonterm === undefined) continue;
        nonterm.forEach((s) => {
          if (isNonterminal(s)) {
            hasNonterm = true;
          }
          follow.add(s);
        });
        follows.set(state, follow);
      }
    }
  }
  // Followを更新したLRアイテムリストを作成して返す
  return items.map((item) => {
    const follow = follows.get(item.state);
    if (follow !== undefined) item.follow = follow;
    return item;
  });
};
