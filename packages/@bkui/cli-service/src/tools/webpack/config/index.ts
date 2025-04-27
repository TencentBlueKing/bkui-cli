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

import type {
  IContext,
} from '../../../types/type';
import type {
  Configuration,
} from 'webpack';
import Config from 'webpack-chain';

import {
  applyUserConfig,
} from './user/index';
import loadMode from './mode/index';
import loadEntry from './entry/index';
import loadExperiments from './experiments/index';
import loadModule from './module/index';
import loadOptimization from './optimization/index';
import loadOutput from './output/index';
import loadPlugins from './plugins/index';
import loadResolve from './resolve/index';
import loadDevServer from './dev-server/index';
import loadDevtool from './devtool/index';
import loadCache from './cache/index';
import loadStats from './stats/index';

/**
 * 生成 webpack 的配置
 */
export default (context: IContext): Configuration => {
  try {
    const config = new Config();

    // load default config
    loadMode(config, context);
    loadEntry(config, context);
    loadExperiments(config, context);
    loadModule(config, context);
    loadOptimization(config, context);
    loadOutput(config, context);
    loadPlugins(config, context);
    loadResolve(config, context);
    loadDevServer(config, context);
    loadDevtool(config, context);
    loadCache(config, context);
    loadStats(config, context);

    // apply user config
    const finalConfig = applyUserConfig(config, context);

    return finalConfig;
  } catch (error: any) {
    const { log } = require('@blueking/cli-utils');
    log.error(error.message || error);
    process.exit(1);
  }
};
