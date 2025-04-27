import path from 'path';

import {
  fileMap,
} from '../file';
import {
  transformJs,
} from './js';
import {
  transformCss,
} from './css';
import {
  transformOther,
} from './other';

import type {
  IContext,
} from '../../../types/type';

// 获取文件处理函数
const getFileTransform = (relativeFilePath: string): typeof transformJs => {
  const transformMap = {
    '.js': transformJs,
    '.css': transformCss,
  };
  const fileExt = path.extname(relativeFilePath);
  return transformMap[fileExt] || transformOther;
};

// 对文件内容进行转换
export const transform = async (__: IContext) => {
  const files = Object.values(fileMap);
  for (const file of files) {
    const transform = getFileTransform(file.outputRelativeFilePath);
    file.content = transform(file);
  }
};
