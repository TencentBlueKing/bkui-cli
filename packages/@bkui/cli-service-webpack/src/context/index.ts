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
import type {
  IContext,
  IOptions,
  Mode,
} from '../types/type';
import {
  loadUserConfig,
} from './user';

const generateContext = (mode: Mode, options?: IOptions): IContext => {
  try {
    process.env.NODE_ENV = mode;

    // 默认配置
    const context: IContext = {
      mode,
      workDir: fs.realpathSync(process.cwd()),
      options: {
        assetsDir: 'static',
        outputAssetsDirName: 'static',
        outputDir: 'dist',
        outputPreserveModuleDir: 'esm',
        publicPath: '/',
        host: '127.0.0.1',
        port: 8080,
        filenameHashing: true,
        cache: true,
        server: 'http',
        open: false,
        runtimeCompiler: true,
        typescript: false,
        tsconfig: './tsconfig.json',
        forkTsChecker: false,
        bundleAnalysis: false,
        parseNodeModules: false,
        replaceStatic: false,
        parallel: true,
        preserveModules: false,
        preserveModulesRoot: 'src',
        customEnv: '',
        whitespace: 'preserve',
        target: 'web',
        libraryTarget: 'umd',
        libraryName: 'MyLibrary',
        splitChunk: true,
        splitCss: true,
        clean: true,
        lazyCompilation: false,
        lazyCompilationHost: 'localhost',
        envPrefix: 'BK_',
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

    // 加载用户配置
    loadUserConfig(context, options);

    return context;
  } catch (error: any) {
    const { log } = require('@blueking/cli-utils');
    log.error(error.message || error);
    process.exit(1);
  }
};

export {
  generateContext,
};
