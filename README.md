# vite-plugin-collect-api
用于自动收集项目的接口api

默认收集 对象方法 函数的第一个参数
默认收集 `request.get` `request.post`

## 使用
```typescript
// vite.config.ts
import vitePluginCollectApi from "vite-plugin-collect-api";

export defalut defineConfig({
    // ...
    plugins: [vitePluginCollectApi()]
})

```

## 传参说明
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| -- | -- | -- | -- | -- |
| collectRule | 自定义收集规则。返回值是 @babel/traverse 遍历的第二个参数visitor。collectApis用于自定义收集规则时收集参数的回调给插件 | collectRule?: <T>(collectApis: (val: string[] \| string) => void) => Visitor<T> |-|1.0.0|
| onBuildDone | 在构建结束后的回调。参数是在此次构建过程中收集的值 | (val: string[]) => void                                      |-|1.0.0|
| callObjectNames | 收集的对象名称 | string[]                                                     |['request']|1.0.0|
| callPropertyNames | 收集的对象方法属性名 | string[] |['get', 'post']|1.0.0|
