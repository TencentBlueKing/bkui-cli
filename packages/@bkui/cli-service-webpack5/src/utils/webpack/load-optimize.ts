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
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { ServiceConfig } from '../../typings/config';
export default (isProd: boolean, config: ServiceConfig)  => {
  const optimization = {
    minimize: isProd,
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    minimizer: [
      new CssMinimizerPlugin({
        cache: true,
        parallel: true,
      }),
      new TerserPlugin({
        exclude: /\.min\.js$/,
        parallel: true,
      }),
    ],
  };
  if (config.needSplitChunks) {
    Object.assign(optimization, {
      splitChunks: {
        chunks: 'all',
        minChunks: 1,
        cacheGroups: {
          bkMagic: {
            enforce: true,
            chunks: 'initial',
            name: 'chunk-bk-magic',
            priority: 20,
            reuseExistingChunk: true,
            test: /\/bk-magic/,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial',
            priority: -10,
            reuseExistingChunk: true,
            enforce: false,
          },
          default: {
            priority: -20,
            chunks: 'initial',
            test: /.*[jt]sx?$/,
            reuseExistingChunk: true,
            enforce: false,
          },
        },
      },
    });
  }
  return optimization as any;
};
