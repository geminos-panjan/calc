import {
  InvalidTokenError,
  UnexpectedEndError,
  UnexpectedTokenError,
} from "../error.js";
import { ParsingType, parsingRules } from "./parsing_rule.js";
import { createParsingTable, echoParsingTableCell } from "./parsing_table.js";
import {
  Token,
  TokenType,
  addParens,
  createTokenList,
  joinTokenList,
} from "../token.js";

/** 構文解析 */

/** ノード状態 */
export type ASTNodeState = TokenType | "EOF" | ParsingType;

export type ASTNodeValue = number | string | undefined | ASTNodeValue[];

export type ASTNode = {
  state: ASTNodeState;
  value: ASTNodeValue;
  tokens: Token[];
  children: ASTNode[];
};

/** 構文解析表 */
const parsingTable = createParsingTable("SENTENCE", parsingRules);

/**
 * 字句解析済みトーク臨ストから抽象構文木を作成
 * @param tokens 字句解析済みトークンリスト
 * @returns 抽象構文木
 */
export const createSyntaxTree = (tokens: Token[]): ASTNode => {
  // スペースは取り除く
  const { tokens: parsingTokens } = addParens(
    tokens.filter((t) => t.type !== "SPACE")
  );
  const error = parsingTokens.find((t) => t.type === "ERROR");
  if (error !== undefined) {
    throw new InvalidTokenError(error.word);
  }
  const stateStack: number[] = [0];
  const nodeStack: ASTNode[] = [];
  // 構文木を作成する
  while (stateStack.length > 0) {
    // 状態スタックの最後を見る
    const index = stateStack[stateStack.length - 1];
    if (index === undefined) break;
    // 構文解析表から行を探索する
    const row = parsingTable[index];
    if (row === undefined) break;
    // トークンリストの先頭の状態を見る
    // なければEOFとする
    const type = parsingTokens[0]?.type ?? "EOF";
    // 状態に対応した規則を探索する
    const cells = row.get(type);
    // なければthrow
    if (cells === undefined) {
      if (0 in parsingTokens) {
        throw new UnexpectedTokenError(parsingTokens[0].word);
      } else {
        throw new UnexpectedEndError();
      }
    }
    let foundOperation = { isContinue: false, error: true };
    for (const cell of cells) {
      // 操作がACCEPTなら終わる
      if (cell.operation === "ACCEPT") {
        foundOperation.isContinue = false;
        foundOperation.error = false;
        break;
      }
      // 操作がSHIFTなら入力を消費して状態スタックとノードスタックにpush
      if (cell.operation === "SHIFT") {
        foundOperation.isContinue = true;
        const token = parsingTokens.shift();
        if (token === undefined) {
          throw new UnexpectedEndError();
        }
        if (cell.operand === undefined) {
          throw new UnexpectedEndError();
        }
        stateStack.push(cell.operand);
        nodeStack.push({
          state: token.type,
          value: token.word,
          tokens: [token],
          children: [],
        });
        const tokens = nodeStack.map((n) => n.tokens).flat();
        const joinTokens = joinTokenList(tokens);
        const echoCell = echoParsingTableCell(cell);
        // console.log(echoCell, joinTokens);
        break;
      }
      // 操作がREDUCEなら状態スタックとノードスタックをパターンの長さ分pop
      if (cell.operation === "REDUCE") {
        if (cell.item === undefined) {
          throw new UnexpectedEndError();
        }
        const pops = cell.item.pattern.states.length;
        // 次の規則を見る
        const gotoIndex = stateStack[stateStack.length - pops - 1];
        if (gotoIndex === undefined) {
          continue;
        }
        foundOperation.isContinue = true;
        stateStack.splice(-pops, pops);
        const nodes = nodeStack.splice(-pops, pops);
        const reducer =
          cell.item.pattern.reducer ?? ((nodes) => nodes[0]?.value);
        const tokens = nodes.map((n) => n.tokens).flat();
        const joinTokens = joinTokenList(tokens);
        const target = stateStack[stateStack.length - 1];
        const echoCell = echoParsingTableCell(cell);
        // console.log(echoCell, joinTokens, target);
        // 新しいノードを作ってノードスタックにpush
        nodeStack.push({
          state: cell.item.state,
          value: reducer(nodes),
          tokens,
          children: nodes,
        });
        const gotos = parsingTable[gotoIndex]?.get(cell.item.state);
        if (gotos === undefined) {
          throw new UnexpectedEndError();
        }
        const goto = gotos.find((goto) => goto !== undefined);
        if (goto?.operand === undefined) {
          throw new UnexpectedEndError();
        }
        stateStack.push(goto.operand);
        break;
      }
    }
    if (foundOperation.isContinue) continue;
    if (!foundOperation.error) break;
    if (parsingTokens[0] !== undefined) {
      throw new UnexpectedTokenError(parsingTokens[0].word);
    }
    throw new UnexpectedEndError();
  }
  if (nodeStack[0] === undefined) {
    throw new UnexpectedEndError();
  }
  return nodeStack[0];
};

export const echoSyntaxTree = (text: string) => {
  const tokens = createTokenList(text);
  const result = createSyntaxTree(tokens).value;
  return {
    input: text,
    result,
  };
};
