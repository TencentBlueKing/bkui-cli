import type {
  IContext,
} from '../../../types/type';

import {
  resolveOutputRelativeFilePath,
} from '../helper/path';

// 处理
export const processOther = async (content: string, originRelativeFilePath: string, context: IContext) => [
  {
    originRelativeFilePath,
    outputRelativeFilePath: resolveOutputRelativeFilePath(originRelativeFilePath, context),
    content,
    needProcess: false,
  },
];

// 解析
export const parseOther = async (__: string) => {
  return [];
};
