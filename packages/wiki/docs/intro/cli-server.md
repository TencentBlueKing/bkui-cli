## Webpack 4 CLI SERVICE

### 安装

```bash
npm install --save-dev @blueking/cli-service-webpack4
```

### 使用

```bash
// 生产环境
bk-cli-service build

// 开发环境
bk-cli-service dev
```
### 自定义配置

> 项目根目录创建 bk.config.js

```javascript
module.exports = {
  // 本地开发 devServer 配置
  devServer: {},

  // 部署应用包时的基本 URL
  publicPath: '/',

  // 生产环境构建产物（相对于前端项目根目录的）目录
  outputDir: 'dist',

  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'static',

  // 项目入口文件路径（相对于前端项目根目录的）
  mainPath: 'src/main.js',

  // index.html 的模版路径（相对于前端项目根目录的）
  indexPath: 'index.html',

  // 开启 preload
  preload: false,

  // 开启 prerender
  prerender: false,

  // 开启 pwa
  pwa: false,

  // 开启 import retry
  importRetry: false,

  // webpack-chain 配置（覆盖）
  chainWebpack: function (config) {

  },

  // webpack config 配置（合并）
  configureWebpack: {

  }
}
```
###  环境变量

#### 环境变量自定义配置

```bash
// 前端项目根目录（相对于 package.json）
BK_APP_ROOT_PATH = "/lib/client"
```

#### 公用环境变量
> 根目录创建 .bk.env

```bash
BK_TEST_STRING = 'test_name'

BK_TEST_OBJECT = {  NAME: 'name', AGE: 'age' }
```

#### 用于生产环境的环境变量
> 根目录创建 .bk.env.production

```bash
BK_MODE = 'production'

BK_TEST_STRING = 'test_name_production'

BK_TEST_OBJECT = {  NAME: 'name', AGE: 'age', env: 'production' }
```

#### 用于开发环境的环境变量
> 根目录创建 .bk.env.development

```bash
BK_MODE = 'development'

BK_TEST_STRING = 'test_name_development'

BK_TEST_OBJECT = {  NAME: 'name', AGE: 'age', env: 'development' }
```
#### 本地开发环境的环境变量
> 根目录创建 .bk.env.local

```bash
BK_MODE = 'local'

BK_TEST_STRING = 'test_name_local'

BK_TEST_OBJECT = {  NAME: 'name', AGE: 'age', env: 'local' }
```

