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
} from '../../../../types/type';
import Config from 'webpack-chain';
import {
  merge,
} from 'webpack-merge';

/**
 * 基于 service 配置生成 webpack 配置后，使用用户配置的 configureWebpack 和 chainWebpack 修改 webpack 配置
 * @param config webpack 配置
 * @param context 上下文
 * @returns webpack 配置
 */
export const applyUserConfig = (config: Config, context: IContext) => {
  const finallyConfig = context.options.chainWebpack(config);
  if (!(finallyConfig instanceof Config)) {
    const { log } = require('@blueking/cli-utils');
    log.error('\nbk.config.js 文件配置有误：\n    chainWebpack 方法需要返回一个 webpack-chain 对象，请修改后重试\n');
    process.exit(0);
  }
  return merge(config.toConfig(), context.options.configureWebpack || {});
};
