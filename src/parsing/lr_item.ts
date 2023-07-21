import { ASTNodeState } from "./parsing_syntax.js";
import { getTokenSample } from "../token.js";
import { FollowSet } from "./follow_set.js";
import { ParsingPattern } from "./parsing_rule.js";

export type LRItem = {
  state: ASTNodeState;
  dot: number;
  follow: FollowSet;
  pattern: ParsingPattern;
};

export const isLRItemEqualExceptFollow = (a: LRItem, b: LRItem): boolean => {
  if (a == undefined || b == undefined) return false;
  if (a.state !== b.state) return false;
  if (a.dot !== b.dot) return false;
  if (a.pattern.states.length !== b.pattern.states.length) return false;
  if (a.pattern.states.some((s, i) => s !== b.pattern.states[i])) return false;
  return true;
};

export const isLRItemEqual = (a: LRItem, b: LRItem): boolean => {
  if (!isLRItemEqualExceptFollow(a, b)) return false;
  if (a.follow.size !== b.follow.size) return false;
  if ([...a.follow].some((s) => !b.follow.has(s))) return false;
  return true;
};

export const echoLRItem = (item: LRItem): string => {
  const pattern = (item.pattern.states as string[])
    .slice(0, item.dot)
    .concat(".", item.pattern.states.slice(item.dot))
    .map((s) => getTokenSample(s));
  const follow = ([...item.follow] as string[]).map((s) => getTokenSample(s));
  return `${item.state} → ${pattern.join(" ")} [ ${follow.join(", ")} ]`;
};
