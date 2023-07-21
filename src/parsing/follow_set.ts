import { ASTNodeState } from "./parsing_syntax.js";

export class FollowSet extends Set<ASTNodeState> {}
export class FollowMap extends Map<ASTNodeState, FollowSet> {}
