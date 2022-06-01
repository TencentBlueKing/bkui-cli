## Webpack 5 CLI 配置案例

### 多页面打包配置
比如一个项目，需要多个页面入口。

```javascript
const isModeProduction = process.env.NODE_ENV === 'production';
const indexPath = isModeProduction ? './index.html' : './index-dev.html'
module.exports = {
    appConfig() {
        return  {
            indexPath,// 指定生成的 index.html 的输出路径
            publicPath: 'https://dev.myapp.com/',// 部署应用包时的基本 URL。webpack.output.publicPath 一致，
            outputDir: 'dist', //生成的生产环境构建文件的目录。webpack.output.path
            pages: {// 多页面配置
                main: {
                    entry: './src/main.ts',// 项目主页面
                },
                panel: {
                    entry: './src/panel.ts',// 面板页面查看页面
                    filename: 'panel.html'
                },
                dashboard: {
                    entry: './src/dashboard.ts', // 仪表盘查看页面
                    filename: 'dashboard.html'
                },
                preview: {
                    entry: './src/preview.ts' // 预览页面
                },
                exception: {
                    entry: './src/exception.ts' // 异常二面
                },
            },
            css: { // 向 CSS 相关的 loader 传递选项
                loaderOptions: {
                    scss: { // sass 公共变量
                        additionalData: '@import "./src/style/variables.scss";',
                    },
                },
            },
            devServer : { // webpack-dev-server
                host: 'dev.myapp.com',
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

多页 具体查看 [pages参数说明](/intro/cli-webpack5-props.html#pages参数说明)


### 打包js-sdk配置
如把项目打包js-sdk输出
```javascript
module.exports = {
    appConfig() {
        return  {
            mainPath: './src/main.ts',
            publicPath:'/',
            outputDir: __dirname + '/dist',
            assetsDir: './',
            minChunkSize: 10000000,
            target: 'lib',
            needSplitChunks: false,
            classificatoryStatic: false,
            library: 'BkDashboard', // 库名，在全局环境下被挂载在window下
        }
    },
};
```
打包成js库 ，建议不分包`needSplitChunks` 设置为`false`，css、js、img、font建议扁平化  `classificatoryStatic` 设置为`false`
### 打包vue组件配置
如把项目打包js-vue组件
```javascript
module.exports = {
    appConfig() {
        return  {
            mainPath: './src/main.ts',
            publicPath:'/',
            outputDir: __dirname + '/dist',
            assetsDir: './',
            minChunkSize: 10000000,
            target: 'wc',
            needSplitChunks: false,
            classificatoryStatic: false,
        }
    },
};
```

