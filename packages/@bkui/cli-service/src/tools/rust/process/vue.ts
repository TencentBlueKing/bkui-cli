import type {
  IContext,
  IOptions,
  FileProcessHandler,
} from '../../../types/type';

import {
  getVueVersion,
  getUniqueId,
} from '../../../lib/util';

const processVue2 = (content: string, filePath: string, __: IOptions) => {
  console.error('vue2 not supported, please contact the author to support');
  return [
    {
      filePath,
      content,
      needProcess: false,
    },
  ];
};

const processVue3 = (content: string, filePath: string, options: IOptions) => {
  const {
    parse,
    compileScript,
    compileStyle,
    compileEntry,
  } = require('../plugin/transform-vue3');
  // 数据
  const scopeId = getUniqueId();
  const processResults: Awaited<ReturnType<FileProcessHandler>> = [];
  // 解析
  const descriptor = parse(content);
  // 编译脚本
  processResults.push(compileScript(descriptor, scopeId, filePath, options));
  // 编译样式
  processResults.push(compileStyle(descriptor, scopeId, filePath, options));
  // 编译入口
  processResults.push(compileEntry(descriptor, scopeId, filePath));
  return processResults;
};

export const processVue = async (content: string, filePath: string, context: IContext) => {
  const vueVersion = getVueVersion();
  if (vueVersion === 2) {
    return processVue2(content, filePath, context.options);
  }
  return processVue3(content, filePath, context.options);
};
