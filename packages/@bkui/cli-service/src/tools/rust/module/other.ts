import type {
  IContext,
  IFile,
} from '../../../types/type';

import {
  resolveOutputAbsoluteFilePath,
} from '../helper/path';

// 处理
export const processOther = async (
  content: string,
  originAbsoluteFilePath: string,
  context: IContext,
): Promise<IFile[]> => [
  {
    originAbsoluteFilePath,
    outputAbsoluteFilePath: resolveOutputAbsoluteFilePath(originAbsoluteFilePath, context),
    content,
    needProcess: false,
    keepOriginFile: true,
  },
];

// 解析
export const parseOther = async (__: string) => {
  return [];
};
