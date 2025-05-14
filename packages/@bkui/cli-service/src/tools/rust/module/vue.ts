import type {
  IContext,
  IOptions,
  IFile,
} from '../../../types/type';

import {
  getVueVersion,
  getUniqueId,
} from '../../../lib/util';

const processVue2 = (content: string, originAbsoluteFilePath: string, __: IOptions) => {
  console.error('vue2 not supported, please contact the author to support');
  return [
    {
      originAbsoluteFilePath,
      outputAbsoluteFilePath: originAbsoluteFilePath,
      content,
      needProcess: false,
    },
  ];
};

const processVue3 = (content: string, originAbsoluteFilePath: string, context: IContext) => {
  const {
    parse,
    compileScript,
    compileStyle,
    compileEntry,
  } = require('../helper/vue3');
  // 数据
  const scopeId = getUniqueId();
  const processResults: IFile[] = [];
  // 解析
  const descriptor = parse(content);
  // 编译脚本
  processResults.push(compileScript(descriptor, scopeId, originAbsoluteFilePath, context));
  // 编译样式
  processResults.push(compileStyle(descriptor, scopeId, originAbsoluteFilePath, context));
  // 编译入口
  processResults.push(compileEntry(descriptor, scopeId, originAbsoluteFilePath, context));
  // 过滤空值
  return processResults.filter(Boolean);
};

export const processVue = async (
  content: string,
  originAbsoluteFilePath: string,
  context: IContext,
): Promise<IFile[]> => {
  const vueVersion = getVueVersion();
  if (vueVersion === 2) {
    return processVue2(content, originAbsoluteFilePath, context.options);
  }
  return processVue3(content, originAbsoluteFilePath, context);
};
