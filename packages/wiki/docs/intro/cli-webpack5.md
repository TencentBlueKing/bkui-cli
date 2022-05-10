## Webpack 5 CLI SERVICE

### 安装

```bash
npm install --save-dev @blueking/cli-service-webpack5
```

### 使用

```bash
webpack5-cli-service [command]

Commands:
  dev              develop with dev mode
  build [options]  build production mode
```

### 功能特性

- 📦 开箱即用的 Webpack 5 能力
- 🛠️ 自定义配置，满足项目个性化需求

### 自定义配置

项目根目录创建 **bk.config.js**

#### 修改 webpack 配置
```js
module.exports = {
  configureWebpack: {
    devServer: {
      host: 'dev.myapp.com',
      port: 7788
    }
  }
}

// 或者使用函数形式

module.exports = {
  configureWebpack (config, option) {
    // option.production ? true : false
    return {
      devServer: {
        host: 'dev.myapp.com',
        port: 7788
      }
    }
  }
}
```

#### 应用配置

```js
module.exports = {
  appConfig: {
    outputDir: 'dist', // 构建产物目录，默认 dist
    assetsDir: 'static', // 放置生成的静态资源 (js、css、img、fonts) 的目录，默认 static
    sourceDir: './src', // 源码目录，默认 ./src
    mainPath: './src/main.js', // 应用入口，默认 ./src/main.js
    indexPath: './public/index.html', // 入口html，默认 ./index.html

    // 环境（全局）变量，可同时作用于模板html和脚本中
    env: {
      BASE_URL: JSON.stringify('/')
    }

    eslintOnSave: true // 开启 eslint，默认关闭
    stylelintOnSave: false // 关闭 stylelint，默认关闭
  }
}

// 同样支持函数形式

module.exports = {
  appConfig (option) {
    // option.production ? true : false
    return {
      sourceDir: './src',
      mainPath: './src/main.js',
      indexPath: './public/index.html',
      env: {
        BASE_URL: option.production ? JSON.stringify('/') : JSON.stringify('/dev')
      }
    }
  }
}
```

#### 完整配置示例

```js

const { resolve } = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const ReplaceStaticUrlPlugin = require('./lib/client/build/replace-static-url-plugin')

const config = require('./lib/client/build/conf')

module.exports = {
  appConfig(option) {
    return {
      sourceDir: './lib/client/src',
      outputDir: resolve(__dirname, './lib/client/dist'),
      mainPath: './lib/client/src/main.js',
      indexPath: option.production ? './lib/client/index.html' : './lib/client/index-dev.html',
      env: option.production ? config.build.env : config.dev.env,
    };
  },

  configureWebpack(webpackConfig, option) {
    const APIPrefix = JSON.parse(config.dev.env.AJAX_URL_PREFIX) || '/api'
    return {
      output: {
        publicPath: option.production ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
      },
      resolve: {
        alias: {
          vue$: 'vue/dist/vue.esm',
        },
      },
      node: {
        global: true,
      },
      devServer: {
        host: config.dev.host,
        port: config.build.port,
        proxy: {
          [APIPrefix]: `http://${config.dev.host}:${config.build.port - 1}`,
        },
        historyApiFallback: true,
        open: true,
        noInfo: false,
        compress: true,
        hot: true,
        quiet: false,
        overlay: {
          errors: true,
        },
        clientLogLevel: 'warn',
        stats: {
          colors: true,
        }
      },
      plugins: [
        new webpack.DefinePlugin(option.production ? config.build.env : config.dev.env),
        new CopyPlugin({
          patterns: [
            {
              from: resolve(__dirname, './lib/client/static'),
              to: config.build.assetsSubDirectory,
              globOptions: { dot: true, ignore: ['.*'] },
            },
          ],
          options: {
            concurrency: 300,
          },
        }),
        new ReplaceStaticUrlPlugin({ fileNamePrefix: 'main' })
      ]
    }
  }
}
```