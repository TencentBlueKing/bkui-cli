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
const chalk = require('chalk');
const fs = require('fs');
const { resolve, parse, join } = require('path');
const portfinder = require('portfinder');
const os = require('os');
const context = process.cwd();

function fileExistsWithCaseSync(filepath) {
  const { base, dir, root } = parse(filepath);

  if (dir === root || dir === '.') {
    return true;
  }

  try {
    const filenames = fs.readdirSync(dir);
    if (!filenames.includes(base)) {
      return false;
    }
  } catch (e) {
    // dir does not exist
    return false;
  }

  return fileExistsWithCaseSync(dir);
}

/**
 * 判断入口文件是否存在
 * @param {*} entry
 * @returns
 */
exports.resolveEntry = (entry) => {
  if (!entry) {
    console.log(chalk.red('入口为空'));
    process.exit(1);
  }

  if (!fs.existsSync(resolve(context, entry))) {
    console.log(chalk.red(`入口 ${resolve(context, entry)} 不存在`));
    process.exit(1);
  }
  return resolve(context, entry);
};

/**
 * 查找文件是否存在context上下文目录中
 * @param {*} context
 * @param {*} files
 * @returns
 */
exports.findExisting = (context, files) => files.find(file => fileExistsWithCaseSync(join(context, file)));

exports.resolveClientEnv = () => ({
  'process.env': Object.keys(process.env).reduce((result, key) => {
    // eslint-disable-next-line no-param-reassign
    result[key] = JSON.stringify(process.env[key]);
    return result;
  }, { NODE_ENV: JSON.stringify(process.env.BK_NODE_ENV) }),
});

/**
 * 解析配置文件路径
 * @param {*} _path
 * @returns
 */
exports.resolveConfigPath = (_path) => {
  if (!_path) return {};

  try {
    const path = resolve(context, _path);
    if (fs.existsSync(path)) {
      const config = require(path);
      return typeof config === 'object' ? config : {};
    }
    return {};
  } catch (err) {
    console.log(chalk.yellow(`配置文件路径${_path}不正确`));
    return {};
  }
};

/**
 * 查找可用端口
 * @param {*} port
 * @returns
 */
exports.findPort = async (port = 8080) => portfinder.getPortPromise({ port: Number(port) }).catch((err) => {
  console.log(err);
  process.exit(1);
});

exports.getIP = () => {
  const ifaces = os.networkInterfaces();
  const defultAddress = '127.0.0.1';
  let ip = defultAddress;

  // eslint-disable-next-line no-restricted-syntax
  for (const dev in ifaces) {
    // eslint-disable-next-line no-prototype-builtins
    if (ifaces.hasOwnProperty(dev)) {
      // eslint-disable-next-line no-loop-func
      ifaces[dev].forEach((details) => {
        if (ip === defultAddress && details.family === 'IPv4') {
          ip = details.address;
        }
      });
    }
  }
  return ip;
};
