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
import getStyleLoaders from './load-styles';
import getFileLoaders from './load-files';
import getScriptLoaders from './load-script';
import getOptimize from './load-optimize';
import getPlugins from './load-plugin';
import getDevServer from './load-devserver';
import { ServiceConfig } from '../../typings/config';
import { Configuration } from 'webpack-dev-server';
import webpack from 'webpack';
export default (config: ServiceConfig): webpack.Configuration & {devServer?: Configuration} => {
  const isProd = process.env.NODE_ENV === 'production';
  const { assetsPath } = config;
  const baseConfig: webpack.Configuration = {
    mode: isProd ? 'production' : 'development',
    entry: { main: config.appIndex },
    output: {
      path: config.dist,
      filename: assetsPath(isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js'),
      chunkFilename: assetsPath(isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js'),
      publicPath: '/',
      clean: true, // 5.20.0+
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
      alias: {
        '@': config.appDir,
      },
      modules: [
        'node_modules',
      ],
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
      },
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            hotReload: !isProd,
          },
        },
        {
          oneOf: [
            ...getScriptLoaders(config),
            ...getStyleLoaders(isProd, config),
            ...getFileLoaders(config),
          ],
        },
      ],
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
      }
    },
    optimization: {
      ...getOptimize(isProd),
    },
    plugins: [
      ...getPlugins(isProd, config),
    ].filter(Boolean),
    watchOptions: {
      ignored: /node_modules/,
    },
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    performance: false,
    devtool: isProd ? false : 'eval-source-map',
    stats: {
      children: false,
      warningsFilter: /export .* was not found in/,
      source: false,
    },
  };

  if (!config.useCustomDevServer) {
    baseConfig.devServer = {
      ...getDevServer(),
    };
  }

  return baseConfig;
};
