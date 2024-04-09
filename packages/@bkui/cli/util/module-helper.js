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
const execa = require('execa');
const path = require('node:path');
const fs = require('node:fs')
const tar = require('tar')

// 下载模板
const installPackage = async (packageName, projectPath) => {
  const { stdout } = await execa('npm', ['pack', packageName])
  const tarballFilename = stdout.trim();
  fs.mkdirSync(projectPath)
  await tar.x({
    file: tarballFilename,
    C: projectPath,
    strip: 1
  })
  fs.unlinkSync(tarballFilename)
}

// 修改模板内容
const modifyPackage = async (projectName, projectPath) => {
  const pkgPath = path.join(projectPath, 'package.json')
  const pkg = JSON.parse(
    fs.readFileSync(pkgPath, 'utf-8'),
  )
  pkg.name = projectName
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  // add .gitignore
  const gitignorePath = path.join(projectPath, 'gitignore')
  const dotGitignorePath = path.join(projectPath, '.gitignore')
  if (fs.existsSync(gitignorePath)) {
    fs.renameSync(gitignorePath, dotGitignorePath)
  }
  // add .npmignore
  const npmignorePath = path.join(projectPath, 'npmignore')
  const dotNpmignorePath = path.join(projectPath, '.npmignore')
  if (fs.existsSync(npmignorePath)) {
    fs.renameSync(npmignorePath, dotNpmignorePath)
  }
}

module.exports = {
  installPackage,
  modifyPackage
}