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
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const { log } = require('@blueking/cli-utils');

function getPackageName(packageName) {
  const index = packageName.lastIndexOf('@');
  let name = packageName;
  if (index > 0) name = packageName.slice(0, index);
  return name;
}

class ModuleHelper {
  constructor() {
    const execaRes = execa.sync('npm', ['root', '-g']);
    this.nodeGlobalPath = execaRes.stdout;
  }

  async installPackage(args = [], options = {}) {
    return await execa('npm', ['install', ...args, '--legacy-peer-deps'], { stdout: process.stdout, stderr: process.stderr, ...options });
  }

  async uninstallPackage(pkg, args = [], options = {}) {
    return await execa('npm', ['uninstall', pkg, ...args], { stdout: process.stdout, stderr: process.stderr, ...options });
  }

  // build render tree
  async renderModuleTree(sourcePath, options) {
    try {
      function load(curPath, tree = {}, treeKey) {
        if (/node_modules$/.test(curPath)) return;
        const stat = fs.statSync(curPath);
        if (stat.isDirectory()) {
          let subTree = tree;
          if (treeKey) {
            tree[treeKey] = {};
            subTree = tree[treeKey];
          }
          const dirs = fs.readdirSync(curPath);
          dirs.forEach((dir) => {
            const dirPath = path.resolve(curPath, dir);
            load(dirPath, subTree, dir);
          });
        } else {
          let originContent = fs.readFileSync(curPath, 'utf8');
          if (!excludeReg.test(treeKey)) originContent = ejs.render(originContent, options, { delimiter: '$' });
          tree[treeKey] = originContent;
        }
        return tree;
      }

      const excludeFileExt = ['bmp', 'gif', 'jpg', 'png', 'jpeg', 'psd', 'svg', 'webp', 'flv', 'avi', 'mov', 'mp4', 'wmv', 'mp3', 'wma', 'rm', 'wav', 'mid'];
      const excludeReg = new RegExp(`(${excludeFileExt.join('|')})$`);
      const modulePath = path.resolve(this.nodeGlobalPath, sourcePath, 'template');
      const moduleTree = load(modulePath);
      return moduleTree;
    } catch (error) {
      log.error(`
          Error when renderModuleTree:
          ${error.message || error}
      `);
      process.exit(1);
    }
  }

  loadModule(pkg) {
    try {
      const name = getPackageName(pkg);
      const modulePath = path.resolve(this.nodeGlobalPath, name);
      const isExists = fs.existsSync(modulePath);
      if (isExists) return require(modulePath);
    } catch (error) {
      log.error(`
          Error when load template config:
          ${error.message || error}
      `);
      process.exit(1);
    }
  }

  async loadModuleInfo(pkg) {
    const name = getPackageName(pkg);
    const isExists = this.existsModule(name);
    if (!isExists) await this.installPackage([name, '-g']);

    const modulePath = path.resolve(this.nodeGlobalPath, name, 'package.json');
    const packageInfo = require(modulePath);
    return packageInfo;
  }

  existsModule(pkg) {
    const modulePath = path.resolve(this.nodeGlobalPath, pkg);
    return fs.existsSync(modulePath);
  }
}

module.exports = new ModuleHelper();
