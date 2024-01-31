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
import type { IOptions } from 'typings';

/**
 * 对用户配置的参数进行校验
 * @param options 用户配置的参数
 */
export const validate = async (options: IOptions) => {
  const Joi = require('joi');
  const { log } = require('@blueking/cli-utils');
  // 构造 schema
  const schema = Joi.object({
    assetsDir: Joi.string().allow(''),
    outputDir: Joi.string(),
    outputAssetsDirName: Joi.string().allow(''),
    publicPath: Joi.string().allow(''),
    filenameHashing: Joi.boolean(),
    cache: Joi.boolean(),
    resource: Joi.object().pattern(
      /\w+/,
      Joi.object({
        entry: Joi.alternatives().try(
          Joi.string(),
          Joi.array(),
        ),
        html: Joi.object(),
      }),
    ),
    copy: Joi.alternatives().try(
      Joi.object({
        from: Joi.string(),
        to: Joi.string(),
        globOptions: Joi.object(),
      }),
      Joi.array().items(Joi.object({
        from: Joi.string(),
        to: Joi.string(),
        globOptions: Joi.object(),
      })),
    ),
    css: Joi.object({
      cssLoaderOptions: Joi.object(),
      preprocessorLoaderOptions: Joi.object(),
    }),
    host: Joi.string(),
    port: Joi.number(),
    https: Joi.alternatives().try(
      Joi.boolean(),
      Joi.object(),
    ),
    open: Joi.boolean(),
    runtimeCompiler: Joi.boolean(),
    typescript: Joi.boolean(),
    tsconfig: Joi.string().allow(''),
    forkTsChecker: Joi.boolean(),
    bundleAnalysis: Joi.boolean(),
    replaceStatic: Joi.alternatives().try(
      Joi.boolean(),
      Joi.object({
        exclude: Joi.array(),
        key: Joi.string(),
      }),
    ),
    parallel: Joi.alternatives().try(
      Joi.boolean(),
      Joi.number(),
    ),
    customEnv: Joi.string().allow(''),
    target: Joi.string().valid('web', 'lib'),
    libraryTarget: Joi.string().allow(''),
    libraryName: Joi.string().allow(''),
    splitChunk: Joi.boolean().allow(''),
    splitCss: Joi.boolean().allow(''),
    clean: Joi.boolean().allow(''),
    parseNodeModules: Joi.boolean().allow(''),
    lazyCompilation: Joi.boolean().allow(''),
    lazyCompilationHost: Joi.string().allow(''),
    envPrefix: Joi.string().allow(''),
    configureWebpack: Joi.alternatives().try(
      Joi.object(),
      Joi.func(),
    ),
    chainWebpack: Joi.func(),
  });
  try {
    await schema.validateAsync(options);
  } catch (err: any) {
    log.error(`\nbk.config.js 文件配置有误：\n    ${err.message || err}\n`);
    process.exit(0);
  }
};
