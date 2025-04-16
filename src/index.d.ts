import { TVitePluginCollectMenuApiOption } from "./type";
import type { PluginOption } from "vite";

declare function vitePluginCollectMenuApi(
  options?: TVitePluginCollectMenuApiOption
): PluginOption;

export { vitePluginCollectMenuApi as default };
