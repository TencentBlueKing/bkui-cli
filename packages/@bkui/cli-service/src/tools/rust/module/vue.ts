import type {
  IContext,
  IOptions,
  IFile,
} from '../../../types/type';

import {
  getVueVersion,
  getUniqueId,
} from '../../../lib/util';

const processVue2 = (content: string, relativeFilePath: string, __: IOptions) => {
  console.error('vue2 not supported, please contact the author to support');
  return [
    {
      relativeFilePath,
      content,
      needProcess: false,
    },
  ];
};

const processVue3 = (content: string, relativeFilePath: string, context: IContext) => {
  const {
    parse,
    compileScript,
    compileStyle,
    compileEntry,
  } = require('../helper/transform-vue3');
  // 数据
  const scopeId = getUniqueId();
  const processResults: IFile[] = [];
  // 解析
  const descriptor = parse(content);
  // 编译脚本
  processResults.push(compileScript(descriptor, scopeId, relativeFilePath, context));
  // 编译样式
  processResults.push(compileStyle(descriptor, scopeId, relativeFilePath, context));
  // 编译入口
  processResults.push(compileEntry(descriptor, scopeId, relativeFilePath, context));
  // 过滤空值
  return processResults.filter(Boolean);
};

export const processVue = async (content: string, relativeFilePath: string, context: IContext) => {
  const vueVersion = getVueVersion();
  if (vueVersion === 2) {
    return processVue2(content, relativeFilePath, context.options);
  }
  return processVue3(content, relativeFilePath, context);
};
