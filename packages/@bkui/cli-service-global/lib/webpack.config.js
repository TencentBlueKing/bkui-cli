/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const { resolveClientEnv } = require('../utils/util');
const Config = require('webpack-chain');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);

module.exports = (entry, appPath = {}) => {
  const app = Object.assign({
    distPath: resolveAppPath('dist'),
    rootPath: resolveAppPath('.'),
    srcPath: resolveAppPath('src'),
    publicPath: resolveAppPath('/'),
    templatePath: path.resolve(__dirname, '../template/index.html'),
    mainPath: path.resolve(__dirname, '../template/main.js'),
  }, appPath);

  const config = new Config();

  config.mode('development');

  config
    .entry('main')
    .add(app.mainPath)
    .end();

  config.output
    .publicPath('./')
    .path(app.distPath)
    .filename('js/[name].js')
    .chunkFilename('js/[name].js')
    .end();

  config.resolve
    .extensions
    .merge(['.mjs', '.js', '.vue', '.json', '.wasm', '.ts', '.tsx'])
    .end()
    .modules
    .add('node_modules')
    .add(path.join(app.rootPath, 'node_modules'))
    .add(path.resolve(__dirname, '../node_modules'))
    .end()
    .alias
    .set('@', app.srcPath)
    .set('vue$', 'vue/dist/vue.runtime.esm.js')
    .set('~entry', entry);

  config.resolveLoader
    .modules
    .add('node_modules')
    .add(path.join(app.rootPath, 'node_modules'));

  config.module
    .noParse(/^(vue|vue-router|vuex|vuex-router-sync)$/);

  config.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))
    .options({
      transformAssetUrls: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href',
      },
    });

  // css loader
  config.module
    .rule('css')
    .test(/\.css$/)
    .use('vue-style-loader')
    .loader(require.resolve('vue-style-loader'))
    .end()
    .use('css-loader')
    .loader(require.resolve('css-loader'));

  // sass loader
  config.module
    .rule('sass')
    .test(/\.s[ac]ss$/i)
    .use('vue-style-loader')
    .loader(require.resolve('vue-style-loader'))
    .end()
    .use('css-loader')
    .loader(require.resolve('css-loader'))
    .end()
    .use('sass-loader')
    .loader(require.resolve('sass-loader'));

  config.module
    .rule('babel')
    .test(/\.tsx?$/)
    .use('babel')
    .loader(require.resolve('babel-loader'))
    .options({
      // include: [app.srcPath],
      configFile: path.resolve(__dirname, '../babel.config.js'),
      cacheDirectory: './webpack_cache/',
      exclude: file => (
        /node_modules/.test(file) && !/\.vue\.js/.test(file)
      ),
    })
    .end()
    .use('ts-loader')
    .loader(require.resolve('ts-loader'))
    .options({
      configFile: path.resolve(__dirname, '../tsconfig.json'),
      appendTsxSuffixTo: [/\.vue$/],
    });

  config.plugin('define')
    .use(webpack.DefinePlugin, [
      resolveClientEnv(),
    ]);

  config.plugin('vue')
    .use(VueLoaderPlugin);

  config.plugin('friendly-errors')
    .use(require('friendly-errors-webpack-plugin'));

  config.plugin('html')
    .use(HtmlWebpackPlugin, [{
      filename: path.resolve(app.distPath, 'index.html'),
      template: app.templatePath,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      sourceMap: true,
      chunksSortMode: 'none',
    }]);

  return config;
};
