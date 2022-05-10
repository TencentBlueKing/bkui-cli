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
module.exports = function () {
  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          loose: false,
          useBuiltIns: 'usage',
          corejs: {
            version: 3,
          },
          targets: {
            browsers: [
              'Chrome >= 46',
              'Firefox >= 45',
              'Safari >= 10',
              'Edge >= 13',
              'iOS >= 10',
              'Electron >= 0.36',
            ],
          },
        },
      ],
      [
        '@vue/babel-preset-jsx',
        {
          // https://github.com/vuejs/composition-api
          compositionAPI: true,
        },
      ],
    ],
    plugins: [
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-transform-modules-commonjs'),
      require('@babel/plugin-proposal-export-namespace-from'),
      require('@babel/plugin-proposal-class-properties'),
      [require('@babel/plugin-transform-runtime'), {
        regenerator: false,
        corejs: false,
        helpers: true,
        useESModules: false,
      }],
    ],
  };
};
