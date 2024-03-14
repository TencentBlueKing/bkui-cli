#!/usr/bin/env node

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
const path = require('node:path')

const minimist = require('minimist')
const ora = require('ora')
const {
  log,
} = require('@blueking/cli-utils')
const handleOverWrite = require('../util/over-write')
const {
  installPackage,
  modifyPackage,
} = require('../util/module-helper')

const argv = minimist(process.argv.slice(2), { string: ['_'] })
const cwd = process.cwd()

const init = async () => {
  try {
    const argProjectName = argv._[0] || 'bkui'
    const argTemplate = argv.template || argv.t || argv._[1]
    const projectPath = path.join(cwd, argProjectName)

    if (!argTemplate) {
      throw new Error('Please select the template first using the format --template or -t')
    }

    await handleOverWrite(projectPath)

    const spinner = ora(`Scaffolding project in ${projectPath}...`).start();
    await installPackage(argTemplate, projectPath)
    await modifyPackage(argProjectName, projectPath)
    spinner.stop();

    log.clear();
    log.done(`

      Successfully initialized the project!
      Please execute the following command:

        cd ${argProjectName}
        npm install
        npm run dev
    `);
  } catch (error) {
    log.error(error.message || error)
  }
}

init()
