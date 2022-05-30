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
```javascript
module.exports = {
    appConfig() {
        return {
            devServer : {
                host: 'dev.myapp.com',
                port: 7788,
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
    },

    eslintOnSave: true, // 开启 eslint，默认关闭
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
更加复杂的配置案例及说明
```javascript

const isModeProduction = process.env.NODE_ENV === 'production';
const indexPath = isModeProduction ? './index.html' : './index-dev.html'
module.exports = {
    appConfig() {
        return  {
            indexPath,// 指定生成的 index.html 的输出路径
            mainPath: './src/main.ts',// 页面入口（如果配置了pages，此配置将不起作用
            publicPath: 'https://dev.myapp.com/',// 部署应用包时的基本 URL。webpack.output.publicPath 一致，
            outputDir: 'dist', //生成的生产环境构建文件的目录。webpack.output.path
            assetsDir: 'static',// 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目
            needSplitChunks: false, // 是否分包
            minChunkSize: 10000, // 分包大小限制
            classificatoryStatic:true,// 生成的静态资源(js、css、img、fonts)  是否放置在 assetsDir 目录下
            pages: {// 多页面配置
                main: {
                    entry: './src/main.ts',
                },
                panel: {
                    entry: './src/panel.ts',
                    filename: 'panel.html'
                },
                dashboard: {
                    entry: './src/dashboard.ts',
                    filename: 'dashboard.html'
                },
                preview: {
                    entry: './src/preview.ts'
                },
                exception: {
                    entry: './src/exception.ts'
                },
                sdk: {
                    entry: './src/sdk.tsx'
                },
            },
            css: { // 向 CSS 相关的 loader 传递选项
                loaderOptions: {
                    scss: {
                        additionalData: '@import "./src/style/variables.scss";',
                    },
                },
            },
            devServer : { // webpack-dev-server
                host: 'dev.bkapps.oa.com',
                port: 7008,
                proxy: {
                    '/api/': {
                        target: 'http://demo.myapp.com',
                        ws: false,
                        changeOrigin: true,
                    },
                }
            }
        }
    },
};

```

### 修改 webpack 配置
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
      devServer: {
        host: config.dev.host,
        port: config.build.port,
        proxy: {
            [APIPrefix]: `http://${config.dev.host}:${config.build.port - 1}`,
        }
      },
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
