# bk-webpack5-service
## 安装

```bash
npm install --save-dev @blueking/cli-service-webpack5
```

## 使用

```
// 生产环境
webpack5-cli-service build

// 开发环境
webpack5-cli-service dev
```
案例：
```json
{
  "scripts": {
    "test": "node ./packages/cli/bin/index.js chart:create test-chart",
    "dev": "webpack5-cli-service dev",
    "build": "webpack5-cli-service build"
  }
}
```

## 自定义配置

项目根目录创建 **bk.config.js**,内如如下：
```js
module.exports = {
    appConfig: {
        devServer : {
            host: 'dev.bkapps.oa.com',
            port: 7008,
        }
    }
}

// 或者使用函数形式，在函数内，你可以直接修改配置，或者返回一个将会被合并的对象

module.exports = {
    appConfig() {
        return {
            devServer : {
                host: 'dev.bkapps.oa.com',
                port: 7008,
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

## Webpack 5 CLI 参数说明
`@blueking/cli-service-webpack5` 3.x已经适配
```json
{
  "webpack": "^5.72.1",
  "webpack-cli": "^4.9.2",
  "webpack-dev-server": "^4.9.0"
}
```
生态，相关的插件参数请注意更新
### appConfig 参数
| 参数                   | 说明                                                              | 类型      | 默认值           |
|----------------------|-----------------------------------------------------------------|---------|---------------|
| outputDir            | 当运行`webpack5-cli-service build`   时生成的生产环境构建文件的目录。              | String  | `./dist`      |
| sourceDir            | `alias: {'@': sourceDir },`                                     | String  | `./src`       |
| mainPath             | 页面入口（如果配置了`pages`，此配置将不起作用)                                     | String  | './src/main.js' |
| indexPath            | 指定生成的 index.html 模板路径，如果 `pages` 配置了`filename`属性，将以`filename`为准 | String  | `index.html`  |
| assetsDir            | 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 ` outputDir`的) 目录。          | String  | `static`      |
| eslintOnSave         | 是否启用`eslint-webpack-plugin`                                     | Boolean | false         |
| stylelintOnSave      | 是否启用 `stylelint-webpack-plugin`                                 | Boolean | false         |
| css                  | 向 CSS 相关的 loader 传递选项 ，具体查看 [### css参数说明](#css参数说明)             | Object  | null          |
| needSplitChunks      | 是否启用默认的配置分包策略`webpack.optimization.splitChunks`                 | Boolean | true          |
| needHashName         | 文件名是否hash                                                       | Boolean | true          |
| pages                | 多页面入口,具体查看 [pages参数说明](#pages参数说明)                              | Object  | null          |
| devServer            | `webpack.devServer` 配置项，具体查看[devServer参数说明](#devServer参数说明)                  | Object  | ————          |
| minChunkSize         | `webpack.optimize.MinChunkSizePlugin`  minChunkSize配置项          | Number  | 10000         |
| classificatoryStatic | 生成的静态资源(js、css、img、fonts)  是否放置在 `assetsDir` 目录下                | Boolean  | true          |
| target               | `webpack.output.libraryTarget`   配置属性                           | String  |            |
| library              | `webpack.output.libraryTarget`   配置属性                           | String  | `web`         |

### css参数说明
向 CSS 相关的 loader 传递选项，如想sass 公共变量设置
```javascript
module.exports = {
    appConfig:{
        // ****
        css: {
            loaderOptions: {
                scss: {
                    additionalData: '@import "./src/style/variables.scss";',
                },
            },
        }
    }
}
```
### pages参数说明
在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。其值应该是一个对象，对象的 key 是入口的名字，value 是：

| 参数                   | 说明                                | 类型     |
|----------------------|-----------------------------------|--------|
| entry            | page 的入口                          | String |  
| template            | 模板来源                              | String |
| filename            | 在 的输出html文件名称，如`dist/index.html ` | String |
| chunks            | chunks 内如，默认 `['chunk-bk-magic', 'vendors', `${key}`]`  | Array  |

```javascript
const isModeProduction = process.env.NODE_ENV === 'production';
const indexPath = isModeProduction ? './index.html' : './index-dev.html'
module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: 'src/index/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  }
}
```
### devServer参数说明
同 [https://webpack.docschina.org/configuration/dev-server/](https://webpack.docschina.org/configuration/dev-server/)

**注意：** ```{ "webpack-dev-server": "^4.9.0"}```,注意webpack-dev-server3 与4 的区别，具体参看：

[https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md](https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md)

#### devServer 默认参数
```typescript
import { Configuration  } from 'webpack-dev-server';
import path from 'path';
export default (): Configuration => ({
    host: '127.0.0.1',
    port: 7000,
    hot: true,
    https: false,
    static: path.join(__dirname, 'static'),
    open: true,
    allowedHosts: 'all',
    client: {
        progress: true,
        overlay: { // 只显示错误信息
            errors: true,
            warnings: false,
        },
        logging: 'warn', // 控制台只显示warn以上信息
    },
});
```
