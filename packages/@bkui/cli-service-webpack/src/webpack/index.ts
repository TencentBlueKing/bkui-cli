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

import fs from 'fs';
import { IContext, Mode } from 'typings';
import { Configuration } from 'webpack';
import loadConfig from './config/index';

module.exports = (mode: Mode): Configuration => {
  process.env.NODE_ENV = mode;

  const context: IContext = {
    mode,
    workDir: fs.realpathSync(process.cwd()),
    options: {
      assetsDir: 'static',
      outputAssetsDirName: 'static',
      outputDir: 'dist',
      publicPath: '/',
      host: '127.0.0.1',
      port: 8080,
      filenameHashing: true,
      cache: true,
      https: false,
      open: false,
      runtimeCompiler: true,
      typescript: false,
      tsconfig: './tsconfig.json',
      forkTsChecker: false,
      bundleAnalysis: false,
      parseNodeModules: false,
      replaceStatic: false,
      parallel: true,
      customEnv: '',
      target: 'web',
      libraryTarget: 'umd',
      libraryName: 'MyLibrary',
      splitChunk: true,
      splitCss: true,
      clean: true,
      lazyCompilation: true,
      lazyCompilationHost: 'localhost',
      copy: [{
        from: './static',
        to: './dist/static',
      }],
      resource: {
        main: {
          entry: './src/main',
          html: {
            filename: 'index.html',
            template: './index.html',
          },
        },
      },
      configureWebpack: {},
      chainWebpack: config => config,
    },
  };

  return loadConfig(context);
};
