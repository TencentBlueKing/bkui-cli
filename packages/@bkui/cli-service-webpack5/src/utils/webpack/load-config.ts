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
import * as webpack from 'webpack';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { merge } from 'webpack-merge';
import createWebpackConfig from './create-config';
import createBundleConfig from '../bundle-config';
import { BundleOptions } from '../../typings/config';
const accessPromise = util.promisify(fs.access);
const isFn = function (exp: any) {
  return Object.prototype.toString.call(exp) === '[object Function]';
};

type WebpackConfigurationGetter = (options: BundleOptions) => Promise<webpack.Configuration>;

export type CustomWebpackConfigurationGetter = (
  originalConfig: webpack.Configuration,
  options: any
) => webpack.Configuration;

export const loadWebpackConfig: WebpackConfigurationGetter = async (option: BundleOptions) => {
  const customWebpackPath = path.resolve(process.cwd(), 'bk.config.js');

  try {
    await accessPromise(customWebpackPath);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const customConfig = await require(customWebpackPath);
    const { configureWebpack = {}, appConfig = {} } = customConfig;

    const bundleConfig = await createBundleConfig(isFn(appConfig) ? appConfig(option) : appConfig, option);
    const baseConfig = createWebpackConfig(bundleConfig);

    if (isFn(configureWebpack)) {
      const resultConfig = configureWebpack(baseConfig, option);
      // 有返回值则执行合并，否则视为直接修改配置
      if (resultConfig) {
        return merge(baseConfig, resultConfig);
      }

      return baseConfig
    }

    return merge(baseConfig, configureWebpack);
  } catch (err) {
    throw err;
  }
};
