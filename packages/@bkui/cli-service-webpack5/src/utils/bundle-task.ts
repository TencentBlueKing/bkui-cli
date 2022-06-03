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
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import { loadWebpackConfig } from './webpack/load-config';
import { BundleOptions } from '../typings/config';

export default async ({ production, analyze = false, silent = false }: BundleOptions) => {
  const webpackConfig = await loadWebpackConfig({ production, analyze });
  const webpackPromise = new Promise<void>((resolve, reject) => {
    if (!production) {
      WebpackDevServer.addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);
      const compiler = webpack(webpackConfig);

      if (!silent) {
        compiler.hooks.invalid.tap('invalid', () => {
          console.log('Compiling...');
        });
      }

      const devServer = new WebpackDevServer(compiler, webpackConfig.devServer);
      devServer.listen(webpackConfig.devServer.port || 7000, webpackConfig.devServer.host || '127.0.0.1', (err:any) => {
        if (err) {
          return console.error(err);
        }

        if (!silent) {
          console.log(chalk.cyan('Starting the development server...\n'));
        }
      });

      if (silent) {
        compiler.hooks.done.tapAsync('done', (stats, callback) => {
          if (!stats.hasErrors()) {
            console.clear();
            console.log(chalk.cyan(`\n  App running at http://${webpackConfig.devServer.host}:${webpackConfig.devServer.port}\n`));
          }
          callback();
        });
      }

      resolve();
    } else {
      const compiler = webpack(webpackConfig);
      compiler.run((err: Error, stats: webpack.Stats) => {
        if (err) {
          reject(err.message);
          return;
        }
        if (stats.hasErrors()) {
          stats.compilation.errors.forEach((e) => {
            console.log(e.message);
          });

          reject('Build failed');
        }
        console.log('\n', stats.toString({ colors: true }), '\n');
        resolve();
      });
    }
  });
  return webpackPromise;
};
