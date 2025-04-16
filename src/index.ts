import type { PluginOption } from "vite";
import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import { isStringLiteral } from "./util";
import type { Visitor } from "@babel/traverse";
import { TVitePluginCollectMenuApiOption } from "./type";

const createCollectApisFn = () => {
  let apis: string[] = [];

  return {
    collectApis: (val: string[] | string) => {
      apis = apis.concat(val);
    },
    reset: () => {
      apis = [];
    },
    getApis: () => {
      return apis;
    },
  };
};

export default function vitePluginCollectMenuApi(
  options?: TVitePluginCollectMenuApiOption
): PluginOption {
  const { collectApis, reset, getApis } = createCollectApisFn();

  const { collectRule, onBuildDone, callObjectNames, callPropertyNames } =
    options || {};

  const _callObjectNames = ["request"].concat(callObjectNames || []);
  const _callPropertyNames = ["get", "post"].concat(callPropertyNames || []);

  return {
    name: "vite-plugin-collect-api",
    buildStart() {
      reset();
    },
    buildEnd() {
      if (onBuildDone) {
        onBuildDone?.(getApis());
      }
    },

    /** 当一个模块解析后会被调用 此时文件已被转换 esbuild est */
    moduleParsed(info) {
      const id = info.id;
      // 只处理 JS/TS 文件
      if (!id.match(/\.(js|ts|jsx|tsx)$/) || id.includes("node_modules")) {
        return;
      }

      const code = info.code;

      if (code) {
        /**
         * 重新转化ast
         * 此时这里info.ast 生成的是esbuild est
         * 暂未找到匹配的遍历包
         *  */
        const ast = parse(code, {
          sourceType: "module",
        });

        const _visitor = collectRule?.(collectApis);
        const {
          CallExpression: CallExpressionInParams,

          ...rest
        } = _visitor || {};

        const visitorWithMerged: Visitor = {
          CallExpression(path, state) {
            const { callee, arguments: args } = path.node;

            // 检查是否为 request.get 或 request.post 调用
            if (
              callee.type === "MemberExpression" &&
              callee.object.type === "Identifier" &&
              callee.property.type === "Identifier" &&
              _callObjectNames.includes(callee.object.name) &&
              _callPropertyNames.includes(callee.property.name)
            ) {
              // 记录调用信息
              const urlArg = args[0];
              if (!urlArg) {
                return;
              }
              /** 字符串 字面量 */
              if (isStringLiteral(urlArg)) {
                // console.log(
                //   "Found request call:",
                //   callee.property.name,
                //   urlArg.value
                // );
                collectApis(urlArg.value);
              } else if (urlArg.type === "Identifier") {
                // 查找变量声明
                const binding = path.scope.getBinding(urlArg.name);
                if (binding) {
                  // 检查变量是否被字面量初始化
                  if (
                    binding.path.node.type === "VariableDeclarator" &&
                    binding.path.node.init &&
                    isStringLiteral(binding.path.node.init)
                  ) {
                    // console.log(`静态值: ${binding.path.node.init.value}`);
                    collectApis(binding.path.node.init.value);
                  }
                }
              }
            }

            if (
              CallExpressionInParams &&
              typeof CallExpressionInParams === "function"
            ) {
              CallExpressionInParams(path, state);
            }
          },
          ...rest,
        };

        traverse(ast, visitorWithMerged);
      }
    },
  };
}
