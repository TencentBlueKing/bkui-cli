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

import { IContext, IReplaceStaticUrlPluginOption } from 'typings';
import Config from 'webpack-chain';
import { extname } from 'path';
import { sources } from 'webpack';
import { RUN_TIME_CHUNK_PERFIX } from '../../../lib/constant';

class ReplaceStaticUrlPlugin {
  opts: IReplaceStaticUrlPluginOption;
  outputAssetsDirName: string;
  target: string;

  constructor(opts, outputAssetsDirName, target) {
    this.opts = opts;
    this.outputAssetsDirName = outputAssetsDirName;
    this.target = target;
  }

  replaceStatic(content, ext) {
    const getFilePath = () => {
      if (this.target === 'lib') {
        // lib 的情况下是平铺
        return './';
      } if (this.outputAssetsDirName) {
        // web & assetsdir 的情况下，需要往上找两级
        return '../../';
      }
      // web & no assetsdir 的情况下，网上找一层即可
      return '../';
    };
    return ext === '.css'
      ? content.replace(
        new RegExp(encodeURI(this.opts.key), 'g'),
        getFilePath(),
      )
      : content.replace(
        new RegExp(`"${this.opts.key}"`, 'g'),
        'window.BK_STATIC_URL + "/"',
      );
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ReplaceStaticUrlPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ReplaceStaticUrlPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          additionalAssets: true,
        },
        (assets) => {
          Object.keys(assets).forEach((filePath) => {
            const asset = compilation.getAsset(filePath);
            const contents = asset.source.source();
            const ext = extname(filePath);
            // 只处理 css 和 runtime js 文件
            if (ext !== '.css' && !(ext === '.js' && filePath.includes(RUN_TIME_CHUNK_PERFIX))) {
              return;
            }
            // 自定义过滤
            if (this.opts?.exclude?.some(exclude => exclude.test(filePath))) {
              return;
            }
            compilation.updateAsset(
              filePath,
              new sources.RawSource(this.replaceStatic(contents.toString(), ext)),
            );
          });
        },
      );
    });
  }
}

// ReplaceStaticUrlPlugin 配置
export default (config: Config, context: IContext) => {
  config.when(context.mode === 'production' && !!context.options.replaceStatic, () => {
    config
      .plugin('replace-static-url-plugin')
      .use(
        ReplaceStaticUrlPlugin,
        [context.options.replaceStatic, context.options.outputAssetsDirName, context.options.target],
      );
  });
};
