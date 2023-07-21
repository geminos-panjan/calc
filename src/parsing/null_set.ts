import { ASTNodeState } from "./parsing_syntax.js";
import { ParsingRule } from "./parsing_rule.js";

export class NullSet extends Set<ASTNodeState> {}

/**
 * Null集合リストを作成
 * @return Null集合
 */
export const createNulls = (parsingRules: ParsingRule[]): NullSet => {
  const nulls = new NullSet();
  let hasChange = true;
  while (hasChange) {
    hasChange = false;
    for (const rule of parsingRules) {
      for (const pattern of rule.patterns) {
        if (
          !nulls.has(rule.state) &&
          pattern.states.every((s) => nulls.has(s))
        ) {
          hasChange = true;
          nulls.add(rule.state);
        }
      }
    }
  }
  return nulls;
};
