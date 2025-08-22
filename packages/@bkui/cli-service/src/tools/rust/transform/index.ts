import {
  transformJs,
} from './js';
import {
  transformCss,
} from './css';
import {
  transformOther,
} from './other';
import {
  extname,
} from '../../../lib/path';

import type {
  IContext,
  IFileMap,
} from '../../../types/type';

// 获取文件处理函数
const getFileTransform = (outputAbsoluteFilePath: string): typeof transformJs => {
  const transformMap = {
    '.js': transformJs,
    '.css': transformCss,
  };
  const fileExt = extname(outputAbsoluteFilePath);
  return transformMap[fileExt] || transformOther;
};

// 对文件内容进行转换
export const transform = async (fileMap: IFileMap, __: IContext) => {
  const files = Object.values(fileMap);
  for (const file of files) {
    const transform = getFileTransform(file.outputAbsoluteFilePath);
    file.content = transform(file, fileMap);
  }
};
