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
const presetHelper = require('../util/preset-helper');
const moduleHelper = require('../util/module-helper');
const { log } = require('@blueking/cli-utils');

async function ensureCommamd(name) {
  const isExists = moduleHelper.existsModule(name);
  if (!isExists) {
    log.clear();
    log.info(`
      Start to init comand, it will take a while!
    `);
    await moduleHelper.installPackage([name, '-g']);
    log.clear();
  }
}

module.exports = async function (program) {
  try {
    const commandDirPath = path.join(__dirname, '..', 'commands');
    const commandNames = fs.readdirSync(commandDirPath);
    // load custom commands
    const presetFile = presetHelper.presetRcFile;
    const customComandNames = Object.keys(presetFile.commands);

    const commands = [
      ...commandNames.map(name => ({ name, path: commandDirPath })),
      ...customComandNames.map(name => ({ name, path: moduleHelper.nodeGlobalPath })),
    ];
    // install custom command
    await Promise.all(customComandNames.map(command => ensureCommamd(command)));

    // register
    commands.forEach((command) => {
      const commandPath = path.join(command.path, command.name);
      require(commandPath)(program);
    });
  } catch (error) {
    log.error(`
        Error when load commands:
        ${error.message || error}
    `);
    process.exit(1);
  }
};
