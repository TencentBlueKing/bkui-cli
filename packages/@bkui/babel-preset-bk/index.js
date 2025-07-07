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
var semver = require('semver');

module.exports = function (__, options) {
  var vueVersion = 2
  try {
    var Vue = require('vue')
    vueVersion = semver.major(Vue.version)
  } catch (e) {}

  var envOptions = {
    loose: false,
    useBuiltIns: 'usage',
    corejs: {
      version: 3,
    },
    targets: {
      browsers: [
        'last 2 versions',
        'not dead',
        'not ie 11',
        '> 0.2%'
      ],
    },
    ...options
  }

  var presets = [
    [
      require('@babel/preset-env'),
      envOptions,
    ],
  ]

  var plugins = [
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
  ]

  if (vueVersion === 2) {
    presets.push([require('@vue/babel-preset-jsx'), { compositionAPI: 'auto' }]);
  } else if (vueVersion === 3) {
    plugins.push([require('@vue/babel-plugin-jsx')]);
  }

  return  {
    sourceType: 'unambiguous',
    overrides: [{
      exclude: [/@babel[/|\\\\]runtime/, /core-js/],
      presets,
      plugins
    }, {
      include: [/@babel[/|\\\\]runtime/],
      presets: [
        [require('@babel/preset-env'), envOptions]
      ]
    }]
  }
};
