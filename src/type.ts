import type { Visitor } from "@babel/traverse";

export type TStringLiteralNode =
  | { type: "StringLiteral"; value: string }
  | { type: "Literal"; value: string };

export type TVitePluginCollectMenuApiOption = {
  /**
   * 自定义收集规则
   * 传递之后所有的默认规则都会失效。以当前的数据为准
   */
  collectRule?: <T>(
    collectApis: (val: string[] | string) => void
  ) => Visitor<T>;
  onBuildDone?: (val: string[]) => void;
  /** 收集的对象名称 */
  callObjectNames?: string[];
  /** 对象方法属性名 */
  callPropertyNames?: string[];
};
