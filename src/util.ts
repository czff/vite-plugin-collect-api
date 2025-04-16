import { TStringLiteralNode } from "./type";

// 类型守卫函数 - 判断是否是字符串字面量
export const isStringLiteral = (node: unknown): node is TStringLiteralNode => {
  if (!node || typeof node !== "object") return false;

  const n = node as Record<string, unknown>;

  // 处理新版 Babel 的 StringLiteral
  if (n.type === "StringLiteral" && typeof n.value === "string") {
    return true;
  }

  // 处理旧版 ESTree 的 Literal
  if (n.type === "Literal" && typeof n.value === "string") {
    return true;
  }

  return false;
};
