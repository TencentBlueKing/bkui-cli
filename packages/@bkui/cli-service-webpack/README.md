# bk-cli-service-webpack
## 安装

```bash
npm install --save-dev @blueking/cli-service-webpack
```

## 使用

```
// 生产环境
bk-cli-service-webpack dev

// 开发环境
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

项目根目录创建 **bk.config.js**,内如如下：
```js
module.exports = {
    {
      assetsDir: 'static',
      outputAssetsDirName: 'static',
      outputDir: 'dist',
      publicPath: '/',
      host: '127.0.0.1',
      port: 8080,
      filenameHashing: true,
      cache: true,
      https: false,
      open: false,
      runtimeCompiler: true,
      typescript: false,
      forkTsChecker: false,
      bundleAnalysis: false,
      parseNodeModules: true,
      replaceStatic: false,
      customEnv: '',
      target: 'web';
      libraryTarget: 'umd';
      copy: {
        from: './static',
        to: './dist/static',
      },
      resource: {
        main: {
          entry: './src/main',
          html: {
            filename: 'index.html',
            template: './index.html',
          },
        },
      },
      configureWebpack: {}, // 此处写 webpack 配置, module 和 plugin 不生效
      chainWebpack: config => config, // 此处使用 webpack-chain 动态修改配置
    }
}
```