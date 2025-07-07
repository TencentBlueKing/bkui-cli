/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 Tencent. All rights reserved.
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
import type { IContext } from '../types/type';
import Config from 'webpack-chain';
import { warmup } from 'thread-loader';
import { isFunction, getVueVersion } from './util';

interface IThreadLoaderOptions {
  workerParallelJobs: number;
  poolRespawn: boolean;
  poolTimeout: number;
  poolParallelJobs: number;
  workers?: number
}

type genLoaderFunction = (rule: Config.Rule, options?: any) => Config.Rule<Config.Module>;

export type ChainLoader = genLoaderFunction & { loaderFn: genLoaderFunction, options: any };

// loader路径
const threadLoaderPath = require.resolve('thread-loader');
const babelLoaderPath = require.resolve('babel-loader');
const tsLoaderPath = require.resolve('ts-loader');
const swcLoaderPath = require.resolve('swc-loader');

const vueVersion = getVueVersion();

const babelLoaderOptions = {
  exclude: (file: string) => (
    /node_modules/.test(file)
    && !/\.vue\.js/.test(file)
  ),
};

const tsLoaderOptions = {
  transpileOnly: true,
  happyPackMode: true,
};

const swcLoaderJscOptions = {
  target: 'es2015',
};

// 生成 thread-loader 的 options
const genThreadLoaderOptions = (parallel: boolean | number) => {
  const threadLoaderOptions: IThreadLoaderOptions = {
    workerParallelJobs: 50,
    poolRespawn: false,
    poolTimeout: 2000,
    poolParallelJobs: 50,
  };
  // 等于 true 的情况下，使用内置 cpu -1 的配置
  if (parallel !== true) {
    threadLoaderOptions.workers = parallel === false ? 1 : parallel;
  }
  return threadLoaderOptions;
};

// 加速 worker 启动
export const warmupWorker = (__: Config, context: IContext) => {
  const warmupLoaders = [
    'babel-loader',
    'ts-loader',
    'swc-loader',
  ];
  if (vueVersion === 2) {
    warmupLoaders.push('vue-loader-bk');
  }
  if (vueVersion === 3) {
    warmupLoaders.push('vue-loader');
  }
  warmup(
    genThreadLoaderOptions(context.options.parallel),
    warmupLoaders,
  );
};

/**
 * 生成 thread-loader 配置
 * @param rule 配置
 * @returns 配置
 */
export const genThreadLoader = (rule: Config.Rule, options: any) => rule
  .use('thread-loader')
  .loader(threadLoaderPath)
  .options(genThreadLoaderOptions(options.parallel))
  .end();

/**
 * 生成 babel-loader 配置
 * @param rule 配置
 * @returns 配置
 */
export const genBabelLoader = (rule: Config.Rule) => rule
  .use('babel-loader')
  .loader(babelLoaderPath)
  .options(babelLoaderOptions)
  .end();

/**
 * 生成 ts-loader 配置
 * @param rule 配置
 * @returns 配置
 */
export const genTsLoader = (rule: Config.Rule, options: any) => rule
  .use('ts-loader')
  .loader(tsLoaderPath)
  .options({
    ...tsLoaderOptions,
    ...options,
  })
  .end();

/**
 * 生成 swc-loader 配置
 * @param rule 配置
 * @param options 配置
 * @returns 配置
 */
export const genSwcLoader = (rule: Config.Rule, options: any) => rule
  .use('swc-loader')
  .loader(swcLoaderPath)
  .options({
    jsc: {
      ...swcLoaderJscOptions,
      ...options,
    },
  })
  .end();

/**
 * 排除 node_modules
 */
export const excludeNodeModules = (rule: Config.Rule) => rule.exclude
  .add(/node_modules/)
  .end();

/**
 * 串联构造 loader 过程
 * @param rule config rule
 * @param loaders 构造 loader 函数
 */
export const loaderChain = (rule: Config.Rule, loaders: ChainLoader[]) => {
  let finalRule = rule;
  loaders.forEach((loader) => {
    if (isFunction(loader)) {
      finalRule = loader(finalRule);
    } else {
      finalRule = loader.loaderFn(finalRule, loader.options);
    }
  });
  return finalRule;
};
