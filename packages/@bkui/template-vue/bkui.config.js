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
const addAxios = require('./axios');
const addEslint = require('./eslint');
const addPostcss = require('./postcss');
const addStylelint = require('./stylelint');
const addVuex = require('./vuex');
const addWebpackConfig = require('./webpack-config');

module.exports = (extendHelp) => {
  extendHelp.addPrompt([
    {
      name: 'features',
      message: 'Select the features that will be used in the project.',
      type: 'checkbox',
      choices: ['Vuex', 'Axios', 'Postcss', 'Eslint', 'Stylelint'],
    },
    {
      name: 'webpack',
      message: 'Select the webpack version',
      type: 'list',
      choices: ['webpack4', 'webpack5'],
    },
  ]);

  extendHelp.modifyPackage((packageJson, answers) => {
    if (answers.webpack === 'webpack4') {
      packageJson.devDependencies['@blueking/cli-service-webpack4'] = '^2.0.0';
    }
    if (answers.webpack === 'webpack5') {
      packageJson.devDependencies['@blueking/cli-service-webpack5'] = '^2.0.0';
    }
  });

  extendHelp.modifyProject((tree, answers) => {
    [addAxios, addEslint, addPostcss, addStylelint, addVuex, addWebpackConfig].forEach((fun) => {
      fun(tree, answers);
    });
  });
};
