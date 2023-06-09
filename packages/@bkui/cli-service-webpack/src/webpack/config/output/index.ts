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

import { IContext } from 'typings';
import Config from 'webpack-chain';

import { getAbsolutePath, getAssetPath } from '../../../lib/util';

export default (config: Config, context: IContext) => {
  // 公共数据
  const path = getAbsolutePath(context.workDir, context.options.outputDir);
  const globalObject = '(typeof self !== \'undefined\' ? self : this)';

  // 构建 web 应用
  if (context.options.target === 'web') {
    config.output
      .path(path)
      .filename(getAssetPath(context.options, `js/[name]${context.options.filenameHashing && context.mode === 'production'  ? '.[contenthash:8]' : ''}.js`))
      .publicPath(context.options.publicPath)
      .set('hashFunction', 'xxhash64')
      .set('clean', context.options.clean);
  }

  // 构建库
  // 目前只支持单 entry
  // publicPath 根据加载的 script 动态生成
  if (context.options.target === 'lib') {
    config.output
      .path(path)
      .filename(getAssetPath(context.options, '[name].js'))
      .publicPath(context.options.publicPath)
      .globalObject(globalObject)
      .set('library', {
        name: context.options.libraryName,
        type: context.options.libraryTarget,
      })
      .set('clean', context.options.clean);
  }
};
