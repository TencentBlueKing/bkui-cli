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
import {  Configuration as WebpackConfiguration } from 'webpack';
export default (config: ServiceConfig): WebpackConfiguration => {
  const isProd = process.env.NODE_ENV === 'production';
  const { assetsPath, publicPath = '/', dist, entry, needHashName, classificatoryStatic,
    devServer, target, library, useCustomDevServer } = config;

  const baseConfig: WebpackConfiguration = {
    mode: isProd ? 'production' : 'development',
    entry,
    output: {
      path: dist,
      filename: assetsPath(`${classificatoryStatic ? 'js/' : ''}[name]${needHashName ? '.[chunkhash]' : ''}.js`),
      chunkFilename: assetsPath(`${classificatoryStatic ? 'js/' : ''}[name]${needHashName ? '.[chunkhash]' : ''}.js`),
      publicPath,
      clean: true, // 5.20.0+
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
      alias: {
        '@': config.appDir,
      },
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
        config: [__filename],
      },
    },
    optimization: {
      ...getOptimize(isProd, config),
    },
    plugins: [
      ...getPlugins(isProd, config),
    ].filter(Boolean),
    devtool: isProd ? false : 'source-map',
    stats: 'errors-only',
  };
  if (!useCustomDevServer) {
    baseConfig.devServer = {
      ...getDevServer(),
      ...(devServer || {}),
    };
  }
  if (target !== 'web') {
    const libraryTarget = ['lib', 'wc'].includes(target) ? 'umd' : target;
    const outputConfig: {[props: string]: string} = {
      libraryTarget,
    };
    if (library) {
      outputConfig.library = library;
    }
    Object.assign(baseConfig.output, outputConfig);
  }

  return baseConfig;
};
