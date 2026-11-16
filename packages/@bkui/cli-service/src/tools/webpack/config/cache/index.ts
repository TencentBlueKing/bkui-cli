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

import fs from 'fs';
import type {
  IContext,
} from '../../../../types/type';
import Config from 'webpack-chain';
import { getAbsolutePath } from '../../../../lib/util';

// 影响构建结果的项目配置文件，变更后需要让持久化缓存失效
const BUILD_DEPENDENCY_FILES = [
  'bk.config.js',
  'postcss.config.js',
  'babel.config.js',
  '.browserslistrc',
  'tsconfig.json',
  'package.json',
];

// cache
export default (config: Config, { options, workDir }: IContext) => {
  config.when(options.cache, () => {
    config.cache({
      type: 'filesystem',
      allowCollectingMemory: true,
      buildDependencies: {
        config: BUILD_DEPENDENCY_FILES
          .map(file => getAbsolutePath(workDir, file))
          .filter(file => fs.existsSync(file)),
      },
    });
  });
};
