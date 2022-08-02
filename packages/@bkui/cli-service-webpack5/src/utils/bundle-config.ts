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
/* eslint-disable no-nested-ternary */
import path from 'path';
import fs from 'fs';
import { ServiceConfig, BundleOptions, AppConfig, OutPages, OutputEntry } from '../typings/config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolveClientEnv } from './read-env';
export const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string): string => path.resolve(appDirectory, relativePath || '.');

export default async function (appConfig: AppConfig, { analyze }: BundleOptions): Promise<ServiceConfig> {
  const isProd = process.env.NODE_ENV === 'production';
  const templateHtml = resolveApp(appConfig.indexPath || './index.html');
  const pages: HtmlWebpackPlugin[] = [];
  const entry: OutputEntry = {};
  let pagesConfig: OutPages = appConfig.pages;
  const { target = 'web', library, useCustomDevServer = false, devServer, dropConsole = true }  = appConfig;
  let { classificatoryStatic = true, needSplitChunks = true, needHashName = isProd } = appConfig;
  if (target !== 'web') {
    classificatoryStatic = false;
    needSplitChunks = false;
    needHashName = false;
  }
  if (!pagesConfig) {
    pagesConfig = {
      main: {
        entry: resolveApp(appConfig?.mainPath || './src/main.js'),
        template: templateHtml,
        filename: 'index.html',
      },
    };
  }
  const keys = Object.keys(pagesConfig);
  keys.forEach((key) => {
    const item = pagesConfig[key];
    if (!item) {
      return;
    }
    const { filename = `${key}.html`, template = templateHtml, entry: entryConfig, title } = item;
    entry[key] = entryConfig;
    if (target === 'web') {
      let chunks = [`${key}`];
      if (appConfig.needSplitChunks !== false) {
        chunks =  ['chunk-bk-magic', 'vendors', `${key}`];
      }
      const obj: Record<string, any> = {
        filename,
        template,
        chunks,
        templateParameters: { ...resolveClientEnv(), ...appConfig.env },
      };
      if (title) {
        obj.title = title;
      }
      if (isProd) {
        obj.minify = {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        };
      }
      pages.push(new HtmlWebpackPlugin(obj));
    }
  });
  const commonConfig = {
    analyze,
    useCustomDevServer,
    env: {
      ...appConfig.env,
    },
    target,
    library,
    dist: resolveApp(appConfig.outputDir || './dist'),
    appDir: resolveApp(appConfig.sourceDir || './src/'),
    publicPath: appConfig.publicPath ?? '/',
    assetsPath(subPath: string) {
      return path.posix.join(appConfig.assetsDir === undefined ? 'static' : appConfig.assetsDir, subPath);
    },
    eslintOnSave: appConfig.eslintOnSave ?? false,
    stylelintOnSave: appConfig.stylelintOnSave ?? false,
    css: appConfig.css ?? {},
    classificatoryStatic,
    needSplitChunks,
    needHashName,
    minChunkSize: appConfig.minChunkSize === undefined ? 10000 : appConfig.minChunkSize,
    entry,
    pages,
    devServer,
    dropConsole,
  };

  return commonConfig;
}
