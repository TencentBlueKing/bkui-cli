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
const Config = require('webpack-chain');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const {
  isPlainObject,
  isFunction,
  hop,
} = require('../utils/assist');

const config = new Config();
const noop = () => {};
const emptyObj = Object.create(null);

const globalConfig = {
  preload: false,
  prerender: false,
  pwa: false,
  importRetry: false,
  devServer: {},
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  mainPath: 'src/main.js',
  indexPath: 'index.html',
  chainWebpack: noop,
  configureWebpack: emptyObj,
};

module.exports = function (mode) {
  process.env.BK_NODE_ENV = mode;

  const workDir = fs.realpathSync(process.cwd());

  let baseGlobalConfig = Object.assign({}, globalConfig);

  // 自定义环境变量
  const applyEnv = () => {
    // 环境变量使用策略
    // 加载通用配置
    // 加载应用场景配置
    // 加载本地私有配置
    if (fs.existsSync(path.resolve(workDir, '.bk.env'))) {
      dotenvExpand(dotenv.config({
        path: path.resolve(workDir, '.bk.env'),
      }));
    }
    if (fs.existsSync(path.resolve(workDir, `.bk.env.${mode}`))) {
      dotenvExpand(dotenv.config({
        path: path.resolve(workDir, `.bk.env.${mode}`),
      }));
    }
    if (fs.existsSync(path.resolve(workDir, '.bk.env.local'))) {
      dotenvExpand(dotenv.config({
        path: path.resolve(workDir, '.bk.env.local'),
      }));
    }
  };

  // 内置配置
  const applyDefaultConfig = () => {
    const configDirPath = path.join(__dirname, '..', 'config');
    const files = fs.readdirSync(configDirPath);

    files.forEach((file) => {
      require(path.join(configDirPath, file))({
        config,
        globalConfig: baseGlobalConfig,
      })();
    });
  };

  // 自定义配置
  const loadLocalConfig  = () => {
    const localConfigPath = path.resolve(workDir, 'bk.config.js');
    if (fs.existsSync(localConfigPath)) {
      const localConfig = require(localConfigPath);
      if (isPlainObject(localConfig)) {
        if (hop(localConfig, 'chainWebpack')
        && !isFunction(localConfig.chainWebpack)) {
          throw new Error('bk.config.js * chainWebpack * 必须为Function');
        }
        if (hop(localConfig, 'configureWebpack') && !isPlainObject(localConfig.configureWebpack)) {
          throw new Error('bk.config.js * configureWebpack * 必须为 Object');
        }
        baseGlobalConfig = Object.assign({}, globalConfig, localConfig);
      } else {
        throw new Error('bk.config.js 解析失败');
      }
    }
  };
  const applyLocalConfig = () => {
    config.merge(baseGlobalConfig.configureWebpack);
    baseGlobalConfig.chainWebpack(config);
  };

  // 加载本地配置 bk.config.js
  loadLocalConfig();

  applyEnv();
  applyDefaultConfig();
  applyLocalConfig();

  return config;
};
