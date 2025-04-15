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

import Config from 'webpack-chain';
import type {
  IContext,
} from '../../../../types/type';
import {
  getAbsolutePath,
  getVueVersion,
  resolveLocal,
} from '../../../../lib/util';
import {
  TARGET_TYPE,
} from '../../../../lib/constant';

export default (config: Config, context: IContext) => {
  const vueVersion = getVueVersion();

  if (vueVersion === 2) {
    config.resolve
      .alias
      .set(
        'vue$',
        context.options.runtimeCompiler
          ? 'vue/dist/vue.esm.js'
          : 'vue/dist/vue.runtime.esm.js',
      );
  } else if (vueVersion === 3) {
    config.resolve
      .alias
      .set(
        'vue$',
        context.options.runtimeCompiler
          ? 'vue/dist/vue.esm-bundler.js'
          : 'vue/dist/vue.runtime.esm-bundler.js',
      );

    config.resolve
      .alias
      .set(
        'vue-router',
        'vue-router/dist/vue-router.mjs',
      );
  }

  if (context.options.target === TARGET_TYPE.LIB) {
    // lib 仅支持单 entry
    const entryVals = Object.values(context.options.resource);
    const entryVal = entryVals[0].entry;
    const libEntry = Array.isArray(entryVal) ? entryVal[0] : entryVal;
    config.resolve
      .alias
      .set('~libEntry', getAbsolutePath(context.workDir, libEntry));
  }

  config.resolve
    .alias
    .set('@', getAbsolutePath(context.workDir, 'src'));

  config.resolve
    .extensions
    .merge(['.mjs', '.js', '.jsx', '.ts', '.tsx', '.vue', '.json', '.wasm']);

  config.resolve
    .modules
    .add('node_modules')
    .add(getAbsolutePath(context.workDir, 'node_modules'))
    .add(resolveLocal('node_modules'));

  config.resolveLoader
    .modules
    .add('node_modules')
    .add(getAbsolutePath(context.workDir, 'node_modules'))
    .add(resolveLocal('node_modules'));

  config.resolve
    .set('fallback', {
      fs: false,
      path: require.resolve('path-browserify'),
    });
};
