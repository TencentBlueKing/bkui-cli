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
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ServiceConfig } from '../../typings/config';

export default (isProd: boolean, config: ServiceConfig) => {
  const { loaderOptions = {} } = config.css;

  const cssLoaders = (isCssModule: boolean = false) => [
    isProd ? { loader: MiniCssExtractPlugin.loader } : 'vue-style-loader',
    {
      loader: 'css-loader',
      options: Object.assign(isCssModule ? {
        esModule: false,
        sourceMap: !isProd,
        modules: {
          localIdentName: '[name]_[local]_[hash:base64:5]'
        }
      } : {
        esModule: false,
        sourceMap: !isProd
      }, loaderOptions.css),
    },
    {
      loader: 'postcss-loader',
      options: {
        ...loaderOptions.postcss,
      }
    },
  ];

  return [
    {
      test: /\.css$/,
      oneOf: [
        {
          resourceQuery: /module/,
          use: [
            ...cssLoaders(true),
          ],
        },
        {
          use: [
            ...cssLoaders(),
          ],
        }
      ],
    },
    {
      test: /\.p(ost)?css$/,
      oneOf: [
        {
          resourceQuery: /module/,
          use: [
            ...cssLoaders(true),
          ],
        },
        {
          use: [
            ...cssLoaders(),
          ],
        }
      ],
    },
    {
      test: /\.s[ac]ss$/,
      oneOf: [
        {
          resourceQuery: /module/,
          use: [
            ...cssLoaders(true),
            {
              loader: 'sass-loader',
              options: { ...(loaderOptions.scss || loaderOptions.sass) },
            },
          ],
        },
        {
          use: [
            ...cssLoaders(),
            {
              loader: 'sass-loader',
              options: { ...(loaderOptions.scss || loaderOptions.sass) },
            },
          ],
        }
      ],
    },
    {
      test: /\.less$/,
      oneOf: [
        {
          resourceQuery: /module/,
          use: [
            ...cssLoaders(true),
            {
              loader: 'less-loader',
              options: { ...loaderOptions.less },
            },
          ],
        },
        {
          use: [
            ...cssLoaders(),
            {
              loader: 'less-loader',
              options: { ...loaderOptions.less },
            },
          ],
        }
      ],
    },
    {
      test: /\.styl(us)?$/,
      oneOf: [
        {
          resourceQuery: /module/,
          use: [
            ...cssLoaders(true),
            {
              loader: 'stylus-loader',
              options: { ...loaderOptions.stylus },
            },
          ],
        },
        {
          use: [
            ...cssLoaders(),
            {
              loader: 'stylus-loader',
              options: { ...loaderOptions.stylus },
            },
          ],
        }
      ],
    },
  ];
};
