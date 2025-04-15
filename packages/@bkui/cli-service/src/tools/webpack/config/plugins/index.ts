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

import loadHtmlWebpackPlugin from './html';
import loadTypescript from './typescript';
import loadCss from './css';
import loadDefine from './define';
import loadCaseSensitivePath from './case-sensitive-path';
import loadVue from './vue';
import loadProgress from './progress';
// import loadEslint from './eslint';
import loadCopy from './copy';
import loadBundleAnalyzer from './bundle-analyzer';
import loadReplaceStaticUrl from './replace-static-url-plugin';
import loadLimitChunkCount from './limit-chunk-count-plugin';

// 加载插件
export default (config: Config, context: IContext) => {
  loadHtmlWebpackPlugin(config, context);
  loadTypescript(config, context);
  loadCss(config, context);
  loadDefine(config, context);
  loadCaseSensitivePath(config, context);
  loadVue(config, context);
  loadProgress(config, context);
  // loadEslint(config, context);
  loadCopy(config, context);
  loadBundleAnalyzer(config, context);
  loadReplaceStaticUrl(config, context);
  loadLimitChunkCount(config, context);
};
