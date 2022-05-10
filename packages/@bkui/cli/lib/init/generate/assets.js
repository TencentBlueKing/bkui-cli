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
const path = require('path');
const fs = require('fs');
const moduleHelp = require('../../../util/module-helper');
const loadTemplateConfig = require('./template-extend');
const { log } = require('@blueking/cli-utils');

async function makeAssets(context, presetData) {
  try {
    // load & exec template modify function
    const customConf = await loadTemplateConfig(presetData.template);

    // modify project
    const projectTree = await moduleHelp.renderModuleTree(presetData.template, presetData.answers);
    await modifyProject(projectTree, customConf, presetData.answers);

    // make assets
    fs.mkdirSync(context);
    await makeFiles(projectTree, context);
  } catch (error) {
    log.error(`
      Error when make assets:
      ${error.message || error}
    `);
    process.exit(1);
  }
}

async function modifyProject(projectTree, customConf, answers) {
  try {
    const { modifyPackageCbs = [], modifyProjectCbs = [] } = customConf;  
    // modify project
    await Promise.all(modifyProjectCbs.map(cb => cb(projectTree, answers)));

    // modify package.json
    const packageJson = JSON.parse(projectTree['package.json']);
    await Promise.all(modifyPackageCbs.map(cb => cb(packageJson, answers)));
    projectTree['package.json'] = JSON.stringify(packageJson, null, 2);
  } catch (error) {
    log.error(`
      Error when modify project by template:
      ${error.message || error}
    `);
    process.exit(1);
  }
}

async function makeFiles(projectTree, filePath) {
  Object.keys(projectTree).forEach(async (file) => {
    const source = projectTree[file];
    // npm 生成 .gitignore
    if (file === 'gitignore') {
      file = '.gitignore'
    }
    const curPath = path.join(filePath, file);
    if (typeof source === 'string') {
      fs.writeFileSync(curPath, source);
    } else {
      fs.mkdirSync(curPath);
      await makeFiles(source, curPath);
    }
  });
}

module.exports = {
  makeAssets,
};
