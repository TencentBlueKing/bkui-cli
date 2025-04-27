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

import { TARGET_TYPE } from '../../../../lib/constant';

// mini-css-extract-plugin 配置
export default (config: Config, context: IContext) => {
  config.when((context.mode === 'production' && context.options.splitCss), () => {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const { getAssetPath } = require('../../../../lib/util');

    const cssName = context.options.target === TARGET_TYPE.WEB
      ? `css/[name]${context.options.filenameHashing ? '.[contenthash:8]' : ''}.css`
      : '[name].css';
    const fileName = getAssetPath(context.options, cssName);
    config
      .plugin('mini-css-extract-plugin')
      .use(MiniCssExtractPlugin, [{
        ignoreOrder: true,
        filename: fileName,
        chunkFilename: fileName,
      }]);
  });
};
