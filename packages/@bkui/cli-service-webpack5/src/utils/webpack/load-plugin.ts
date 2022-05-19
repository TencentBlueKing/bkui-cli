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
import webpack from 'webpack';
import VueLoaderPlugin  from 'vue-loader/lib/plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
// import stylelintFormatter from 'stylelint-formatter-pretty';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import chalk from 'chalk';
import { resolveClientEnv } from '../read-env';

export default (isProd: boolean, config: any) => {

  const plugins =  [
    config.eslintOnSave ? new ESLintPlugin({
      extensions: ['js', 'vue'],
      files: [config.appDir],
      failOnWarning: true,
      formatter: require('eslint-friendly-formatter'),
    }) : undefined,

    config.stylelintOnSave ? new StylelintPlugin({
      files: ['**/*.vue', '**/*.s?(a|c)ss'],
      failOnWarning: true,
      // formatter: stylelintFormatter,
    }) : undefined,
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)\n`,
    }),

    new webpack.DefinePlugin({ ...resolveClientEnv(), ...config.env }),

    new VueLoaderPlugin(),

    isProd ? new MiniCssExtractPlugin({
      filename: config.assetsPath(`${config.classificatoryStatic ? 'css/' : ''}[name]${config.needHashName ? '.[contenthash:7]' : ''}.css`),
      ignoreOrder: true,
    }) : undefined,
    config.minChunkSize !== 0 ? new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: config.minChunkSize,
    }) : undefined,
    new webpack.NoEmitOnErrorsPlugin(),
    config.analyze ? new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 7002,
    }) : undefined,

  ];
  return plugins;
};
