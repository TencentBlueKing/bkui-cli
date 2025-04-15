# bk-cli-service-webpack

## 安装

```bash
npm install --save-dev @blueking/cli-service-webpack
```

## 使用

```
// 开发环境
bk-cli-service-webpack dev

// 生产环境
bk-cli-service-webpack build
```

案例：

```json
{
  "scripts": {
    "dev": "bk-cli-service-webpack dev",
    "build": "bk-cli-service-webpack build"
  }
}
```

## 配置

可以在 `${ROOT}/bk.config.js` 中编写构建相关的配置，可以使用 `defineConfig` 函数（`@blueking/cli-service` 导出了这个函数，有完善的类型支持）来定义配置，完整配置如下：

```js
module.exports = {
  assetsDir: "static",
  outputAssetsDirName: "static",
  outputDir: "dist",
  outputPreserveModuleDir: "esm",
  publicPath: "/",
  host: "127.0.0.1",
  port: 8080,
  filenameHashing: true,
  cache: true,
  server: "http",
  open: false,
  runtimeCompiler: true,
  typescript: false,
  tsconfig: "./tsconfig.json",
  forkTsChecker: false,
  bundleAnalysis: false,
  parseNodeModules: false,
  replaceStatic: false,
  parallel: true,
  preserveModules: false,
  preserveModulesRoot: "src",
  preserveModulesOnly: false,
  customEnv: "",
  whitespace: "preserve",
  target: "web",
  libraryTarget: "umd",
  libraryName: "MyLibrary",
  splitChunk: true,
  splitCss: true,
  clean: true,
  lazyCompilation: false,
  lazyCompilationHost: "localhost",
  envPrefix: "BK_",
  copy: [
    {
      from: "./static",
      to: "./dist/static",
    },
  ],
  resource: {
    main: {
      entry: "./src/main",
      html: {
        filename: "index.html",
        template: "./index.html",
      },
    },
  },
  configureWebpack: {}, // 此处写 webpack 配置, 优先级高于 chainWebpack
  chainWebpack: (config) => config, // 此处使用 webpack-chain 动态修改配置
};
```

## 配置详解

### assetsDir

项目使用的静态资源目录名

### outputAssetsDirName

构建完输出的静态资源目录名

### outputDir

构建输出目录

### outputPreserveModuleDir

构建完 PreserveModule 输出的目录名

### publicPath

webpack 的 publicPath 配置

### host

本地开发使用的 host

### port

本地开发使用的 port

### filenameHashing

构建完的文件是否使用 hash

### cache

是否使用缓存，推荐开启，可极大提升开发效率

### https

是否启用 https。开启后本地开发可以使用 https，无需额外配置证书

### open

启动本地开发的时候，是否自动打开浏览器

### typescript

是否是 ts 项目

### tsconfig

tsconfig 地址

### forkTsChecker

是否启用独立进程处理类型检查

### bundleAnalysis

是否对构建文件进行分析

### parseNodeModules

是否对 node_modules 里面的文件进行构建

### preserveModules

是否启用 PreserveModule 模式

### preserveModulesRoot

PreserveModule 的根目录

### preserveModulesOnly

是否只对 PreserveModule 进行构建

### replaceStatic

是否替换静态资源地址

### parallel

是否启用多进程构建，可以填 bool 或者 number

### customEnv

自定义变量文件地址，可以加载自定义变量

### whitespace

是否保留空白

### target

可以填 web、library

### libraryTarget

webpack 的 libraryTarget

### libraryName

构建 library 的名称

### splitChunk

是否自动拆分构建文件

### splitCss

是否将 css 构建到一个独立的文件中

### clean

每次构建前，是否清除目录

### copy

复制文件配置

### resource

html 和 entry 挂载的配置

### lazyCompilation

是否开启懒加载

### lazyCompilationHost

懒加载 Host

### envPrefix

环境变量前缀，默认 BK\_

### configureWebpack

可以是函数或者对象。此处写 webpack 配置, 优先级高于 chainWebpack

### chainWebpack

这里编写函数，参数是 chain，需要返回修改后的 chain。使用 chain 的形式，修改 webpack 的所有配置
