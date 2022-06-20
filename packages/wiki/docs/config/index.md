## 配置与依赖

`@blueking/cli-service-webpack5`  适配webpack版本为:
```json
{
  "webpack": "^5.72.1",
  "webpack-cli": "^4.9.2",
  "webpack-dev-server": "^4.9.0"
}
```
相关的插件参数请注意更新

### 需要关注的包更新
```json
{
  "babel-loader": "^8.2.5",
  "copy-webpack-plugin": "^11.0.0",
  "css-loader": "^6.7.1",
  "css-minimizer-webpack-plugin": "^4.0.0",
  "eslint-friendly-formatter": "^4.0.1",
  "eslint-webpack-plugin": "^3.1.1",
  "html-webpack-plugin": "^5.5.0",
  "mini-css-extract-plugin": "^2.6.0",
  "postcss-loader": "^7.0.0",
  "sass-loader": "^13.0.0",
  "style-loader": "^3.3.1",
  "stylelint-formatter-pretty": "^3.1.0",
  "stylelint-webpack-plugin": "^3.3.0",
  "terser-webpack-plugin": "^5.3.1",
  "ts-loader": "^9.3.0",
  "ts-node": "^9.0.0",
  "tslib": "^2.1.0",
  "typescript": "^4.0.5",
  "vue-loader": "^15.9.5",
  "vue-template-compiler": "^2.6.12",
  "webpack": "^5.72.1",
  "webpack-bundle-analyzer": "^4.5.0",
  "webpack-cli": "^4.9.2",
  "webpack-dev-server": "^4.9.0",
  "webpack-merge": "^5.8.0"
}
```

## 版本适配注意事项
webpack版本升级到`webpack5.72.1` 后，之前的配置需要调整，其中特别注意事项有：
### webpack-dev-server
webpack-dev-server3.x升级到 webpack-dev-server4.9.x

主要注意事项：
+ quiet：移除，官方迁移文章建议可以在infrastructrueLogging中修改，这部分其实没看明白，目前直接把infrastructrueLogging.level设置为info，显示错误告警与信息，但是又用了friendly-errors-webpack-plugin，导致错误告警显示2次，直接用none的话又没有基础设施日志，求解答！
+ overlay：移至client中
+ clientLogLevel：移至client中，更改为logging属性
+ disableHostCheck：更改为allowedHosts，可以自行增加白名单
> 官网3升4教程：[https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md](https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md)

具体根据官方文档调整配置:[https://www.npmjs.com/package/webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)
### mini-css-extract-plugin
在wepback4之前会配置  cache: true，现在这个配置没有了，ts会报错。具体参看如下：


|  选项名  |  类型  |  默认值  |   描述  |
|  ----   | ----   |----   |----   |
|  test  |     String&#124;RegExp&#124;Array<String&#124;RegExp>  |     `/\.css(\?.*)?$/i`  |     匹配要处理的文件    |
|  include  |     String&#124;RegExp|Array<String&#124;RegExp>  |     undefined |     要引入的文件    |
|  exclude  |     String&#124;RegExp|Array<String&#124;RegExp>  |     undefined |     要排除的文件    |    
|  parallel  |     Boolean&#124;Number  |     true  |     启用/禁用多进程并行处理。   |
|  minify  |     `Function&#124;Array<Function> ` |   `CssMinimizerPlugin.cssnanoMinify`  |     允许覆盖默认的 minify 函数。   |
|  minimizerOptions  |    ` Object&#124;Array<Object>`  |     `{ preset: 'default' }`  |     Cssnano 优化 配置项。   |
|  warningsFilter  |     `Function<(warning, file, source) -> Boolean>` |   `() => true`    |     允许过滤掉 css-minimizer 的警告 |


具体查看官网：[https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#minimizeroptions](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#minimizeroptions)

### terser-webpack-plugin
同样也没有cache配置了.
webpack4的时候可以通过terser-webpack-plugin的cache属性开启文件缓存。现在webpack5自身提供了持久化缓存机制，它能够将首次打包的结果缓存到硬盘中，等下次打包的时候就可以跳过一系类的耗时的操作，复用第一次的打包结果。可以通过以下配置开启持久化缓存：
```javascript
cache: {
 type: 'filesystem',
 version: 'yourVersion'
}
```
具体查看官网：[https://webpack.js.org/plugins/terser-webpack-plugin/](https://webpack.js.org/plugins/terser-webpack-plugin/)
