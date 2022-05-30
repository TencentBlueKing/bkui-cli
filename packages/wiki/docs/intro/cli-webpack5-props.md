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
