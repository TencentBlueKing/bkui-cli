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

import path from 'path';
import type { IOptions } from 'typings';
import semver from 'semver';

/**
 * 获取资源路径
 * @param options 配置
 * @param filePath 文件路径
 * @returns 资源路径
 */
export const getAssetPath = (options: IOptions, filePath: string) => (
  options.outputAssetsDirName
    ? path.posix.join(options.outputAssetsDirName, filePath)
    : filePath
);

/**
 * 返回资源绝对路径
 * @param workDir 项目路径
 * @param paths 资源相对路径
 * @returns 绝对路径
 */
export const getAbsolutePath = (workDir: string, ...paths: string[]) => path.resolve(workDir, ...paths.filter(v => v));

/**
 * 判断是否是绝对路径
 * @param userPath 路径
 * @returns 是否是绝对路径
 */
export const isAbsolutePath = (userPath: string) => path.isAbsolute(userPath);

/**
 * 处理用户输入的路径，如果是绝对路径直接返回，如果是相对路径，返回绝对路径
 * @param workDir 用户目录
 * @param userPath 文件路径
 * @returns 文件绝对路径
 */
export const resolveUserPath = (workDir: string, userPath: string) => {
  if (isAbsolutePath(userPath)) {
    return userPath;
  }
  return getAbsolutePath(workDir, userPath);
};

/**
 * 返回 cli service 所以目录的相对目录
 * @param workDir 用户目录
 * @param _path 文件路径
 * @returns 文件绝对路径
 */
export const resolveLocal = (...dirs) => path.join(__dirname, '../../', ...dirs);

/**
 * 判断值是否为对象
 * @param { unknown } target 值
 * @returns boolean
 */
export const isObject = (target: unknown) => Object.prototype.toString.call(target) === '[object Object]';

/**
 * 判断值是否为字符串
 * @param { unknown } target 值
 * @returns boolean
 */
export const isString = (target: unknown) => typeof target === 'string';

/**
 * 判断值是否为数组
 * @param { unknown } target 值
 * @returns boolean
 */
export const isArray = (target: unknown) => Array.isArray(target);

/**
 * 判断值是否为函数
 * @param { unknown } target 值
 * @returns boolean
 */
export const isFunction = (target: unknown) => Object.prototype.toString.call(target) === '[object Function]';

/**
 * 判断值是否为空
 * @param { unknown } value 值
 * @returns boolean
 */
export const isEmpty = (value: unknown) => {
  if (value === ''
      || value === null
      || value === undefined) {
    return true;
  }
  if (Array.isArray(value) && value.length < 1) {
    return true;
  }
  if (isObject(value) && Object.keys(value).length < 1) {
    return true;
  }
  return false;
};

/**
 * 获取 vue 版本
 * @returns vue 版本
 */
export const getVueVersion = () => {
  let vue;
  try {
    vue = require('vue');
  } catch (error) {

  }
  const vueVersion = vue ? semver.major(vue.version) : undefined;
  return vueVersion;
};

/**
 * deep merge
 * @param target 目标对象
 * @param source 源对象
 * @returns 深度合并对象
 */
export const deepMerge = <T extends Object, U extends Object>(target: T, source: U): T & U => {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        result[key] = deepMerge(target[key], value);
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }

  return result as  T & U;
};
