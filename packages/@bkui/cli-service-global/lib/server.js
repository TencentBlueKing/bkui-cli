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
const fs = require('fs');
const { resolve } = require('path');
const { resolveEntry, getIP, findPort } = require('../utils/util');
const chalk = require('chalk');

/**
 * 处理配置
 * @param {*} config
 * @param {*} type serve类型
 * @returns
 */
const handleResolveConfig = (cmd, type) => {
  const {
    port,
    host,
    showDir = true,
    cache = true,
    timeout,
    proxy = {},
    dotfiles,
    open = true,
    webpack = {},
    gzip,
  } = cmd;
  if (type === 'dir') {
    return {
      port, host, showDir, cache, timeout, proxy, dotfiles, open, gzip,
    };
  }
  return {
    port, host, open, webpack, gzip, proxy,
  };
};
const abnormalCloseServer = (server) => {
  const signalList = ['SIGINT', 'SIGTERM'];
  signalList.forEach((signal) => {
    process.on(signal, () => {
      server.close(() => process.exit(0));
    });
  });
};
/**
 * 处理目录类型
 * @param {*} entry
 * @param {*} config
 */
const handleServeDir = async (entry, config) => {
  const { createServer } = require('http-server');
  const open = require('open');
  const server = createServer({
    root: entry,
    ...config,
  });
  abnormalCloseServer(server);
  const port = await findPort(config.port);
  server.listen(port, config.host, () => {
    if (config.open) {
      open(`http://${config.host}:${port}`);
    }
    console.log(chalk.cyan(`dev server已启动 127.0.0.1:${port}`));
    console.log(chalk.cyan(`http://${getIP()}:${port}`));
    console.log(chalk.cyan(`http://${config.host}:${port}\n`));
  });
};

/**
 * 文件类型 -- Vue
 * @param {*} entry
 * @param {*} config
 */
const handleServeVue = async (entry, config) => {
  const { findExisting, resolveConfigPath } = require('../utils/util');
  const getWebpackConfig = require('./webpack.config');
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const { merge } = require('webpack-merge');

  const appPath = {
    mainPath: /\.(t|j)s$/.test(entry) ? entry : resolve(__dirname, '../template/main.js'),
  };
  // 优先查找项目的模板文件
  appPath.templatePath = findExisting(process.cwd(), [
    'index-dev.html',
    'public/index-dev.html',
    'static/index-dev.html',
  ]) || resolve(__dirname, '../template/index.html');

  const webpackConfig = merge(getWebpackConfig(entry, appPath).toConfig(), resolveConfigPath(config.webpack) || {});
  // console.log(webpackConfig)
  // devserver 配置
  const devServerConfig = {
    open: config.open,
    compress: config.gzip,
    hot: true,
    quiet: true,
    overlay: {
      errors: true,
    },
    clientLogLevel: 'debug',
    stats: {
      colors: true,
    },
    host: config.host,
    proxy: config.proxy,
  };

  try {
    // webpack编译
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, devServerConfig);

    abnormalCloseServer(server);

    const port = await findPort(config.port);
    server.listen(port, config.host, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log(chalk.cyan(`dev server已启动 127.0.0.1:${port}`));
      console.log(chalk.cyan(`http://${getIP()}:${port}`));
      console.log(chalk.cyan(`http://${config.host}:${port}\n`));
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * 处理文件类型
 * @param {*} entry
 * @param {*} config
 */
const handleServeFile = async (entry, config) => {
  if (/\.((t|j)s|(tsx)|(vue))$/.test(entry)) {
    await handleServeVue(entry, config);
  }
};

module.exports = (_entry = './', cmd) => {
  const entry = resolveEntry(_entry);
  const stat = fs.lstatSync(entry);

  if (stat.isDirectory()) {
    const config = handleResolveConfig(cmd, 'dir');
    handleServeDir(entry, config);
  } else {
    const config = handleResolveConfig(cmd, 'file');
    handleServeFile(entry, config);
  }
};
