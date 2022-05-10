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
const resolveClientEnv = require('../utils/resolveClientEnv');
const resolveAppPath = require('../utils/resolveAppPath');
const path = require('path');

module.exports = ({
  config,
  globalConfig,
}) => {
  const isModeProduction = process.env.NODE_ENV === 'production';

  const resolveLocal = name => path.join(__dirname, '../../', name);

  return () => {
    config.mode(process.env.NODE_ENV);

    config.when(process.env.NODE_ENV !== 'production', (config) => {
      config.devtool('cheap-source-map');
    });

    config.cache({
      type: 'filesystem',
    });

    config.entry('main')
      .add(resolveAppPath(globalConfig.mainPath))
      .end();

    const resolvePath = name => path.posix.join(globalConfig.assetsDir, `${name}`);
    config.output
      .publicPath(globalConfig.publicPath)
      .path(resolveAppPath(globalConfig.outputDir))
      .filename(isModeProduction ? resolvePath('js/[name].[chunkhash].js') : resolvePath('js/[name].js'))
      .chunkFilename(isModeProduction ? resolvePath('js/[name].[chunkhash].js') : resolvePath('js/[name].js'))
      .end();

    config.resolve
      .extensions
      .merge(['.js', '.jsx', '.vue', '.json'])
      .end()
      .modules
      .add('node_modules')
      .add(resolveLocal('node_modules'))
      .end();

    config.resolveLoader
      .modules
      .add('node_modules')
      .add(resolveLocal('node_modules'));

    config.module
      .noParse(/^(vue|vue-router|vuex|vuex-router-sync)$/);

    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('cache-loader')
      .loader(require.resolve('cache-loader'))
      .end()
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

    config.module
      .rule('babel')
      .test(/.[jt]sx?$/)
      .use('cache-loader')
      .loader(require.resolve('cache-loader'))
      .end()
      .use('babel')
      .loader(require.resolve('babel-loader'))
      .options({
        include: [resolveAppPath('src')],
        cacheDirectory: true,
        exclude: file => (
          /node_modules/.test(file) && !/\.vue\.js/.test(file)
        ),
      });

    config.plugin('define')
      .use(webpack.DefinePlugin, [
        resolveClientEnv(),
      ]);

    config.plugin('vue')
      .use(VueLoaderPlugin);

    config.plugin('html')
      .use(HtmlWebpackPlugin, [{
        filename: 'index.html',
        template: resolveAppPath(globalConfig.indexPath),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
        sourceMap: true,
        chunksSortMode: 'none',
      }]);
  };
};
