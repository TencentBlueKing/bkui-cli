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
const chalk = require('chalk');
// const portfinder = require('portfinder')
const WebpackDevServer = require('webpack-dev-server');

module.exports = function (webpackConfig) {
  const compiler = webpack(webpackConfig.toConfig());

  const chainDevServer = compiler.options.devServer;

  const server = new WebpackDevServer(
    compiler,
    chainDevServer,
  )

  ;['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      server.close(() => {
        console.log('');
        console.log('exit');
        console.log('');
        process.exit(0);
      });
    });
  });

  server.listen(chainDevServer.port, chainDevServer.host, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });

  compiler.hooks.done.tap('dev', () => {
    const empty = '    ';
    const common = `
    App running at:
    - dev  at: local.apps.com:${chainDevServer.port}${compiler.options.output.publicPath}
    - dev  at: ${chainDevServer.host}:${chainDevServer.port}${compiler.options.output.publicPath}
    `;
    console.log(chalk.cyan(`\n${empty}${common}`));
  });

  // portfinder.getPort({
  //   port: 3000,
  //   stopPort: 3333
  // }, (err, port) => {
  //   if (err) {
  //     console.log('')
  //     console.log(err)
  //     console.log('')
  //     process.exit(1)
  //   }
  //   server.listen(port, chainDevServer.host, (err) => {
  //     if (err) {
  //       console.log(err)
  //       process.exit(1)
  //     }
  //     console.log('')
  //     console.log(chalk.cyan(`dev server已启动 127.0.0.1:${port}`))
  //     console.log('')
  //   })
  // })
};
