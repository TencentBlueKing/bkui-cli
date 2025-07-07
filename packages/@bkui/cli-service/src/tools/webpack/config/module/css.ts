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

import type {
  IContext,
} from '../../../../types/type';
import Config from 'webpack-chain';

export default (config: Config, context: IContext) => {
  const isProd = context.mode === 'production';
  const cssOptions = context.options.css;

  const loadCssRule = (lang: string, test: RegExp, cssloader: null | string = null, options = null) => {
    const baseRule = config.module.rule(lang).test(test);

    // rules for <style module>
    const vueModulesRule = baseRule.oneOf('vue-modules').resourceQuery(/module/);
    applyLoaders(vueModulesRule, true);

    // rules for <style>
    const vueNormalRule = baseRule.oneOf('vue').resourceQuery(/\?vue/);
    applyLoaders(vueNormalRule);

    // rules for *.module.* files
    const extModulesRule = baseRule.oneOf('normal-modules').test(/\.module\.\w+$/);
    applyLoaders(extModulesRule);

    // rules for normal CSS imports
    const normalRule = baseRule.oneOf('normal');
    applyLoaders(normalRule);

    function applyLoaders(configRule: Config.Rule<Config.Rule<Config.Module>>, forceCssModule = false) {
      const cssLoaderOptions = Object.assign({
        importLoaders: 2,
      }, cssOptions?.cssLoaderOptions);

      if (forceCssModule) {
        cssLoaderOptions.modules = {
          ...cssLoaderOptions.modules,
          auto: () => true,
        };
      }

      if (cssLoaderOptions.modules) {
        cssLoaderOptions.modules = {
          localIdentName: '[name]_[local]_[hash:base64:5]',
          ...cssLoaderOptions.modules,
        };
      }

      if (isProd && context.options.splitCss) {
        configRule
          .use('extract-css-loader')
          .loader(require('mini-css-extract-plugin').loader)
          .options({
            publicPath: context.options.publicPath,
          });
      } else {
        configRule
          .use('vue-style-loader')
          .loader(require.resolve('vue-style-loader'));
      }

      configRule
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .options(cssLoaderOptions);

      // post-css 使用项目配置
      configRule
        .use('postcss-loader')
        .loader(require.resolve('postcss-loader'));

      // 预处理器
      if (cssloader && options) {
        configRule
          .use(cssloader)
          .loader(require.resolve(cssloader))
          .options(options);
      }
    }
  };

  loadCssRule('css', /\.css$/);
  loadCssRule('postcss', /\.p(ost)?css$/);
  loadCssRule('stylus', /\.styl(us)?$/, 'stylus-loader', { ...cssOptions?.stylusLoaderOptions });
  loadCssRule('less', /\.less$/, 'less-loader', { ...cssOptions?.lessLoaderOptions });
  loadCssRule('scss', /\.scss$/, 'sass-loader', { ...cssOptions?.scssLoaderOptions });
  loadCssRule('sass', /\.sass$/, 'sass-loader', Object.assign(
    {},
    cssOptions?.sassLoaderOptions,
    {
      sassOptions: Object.assign(
        {},
        cssOptions?.sassLoaderOptions?.sassOptions,
        {
          indentedSyntax: true, // 缩进语法
        },
      ),
    },
  ));
};
