import {
  transform,
} from '@swc/core';
import type {
  IContext,
  IFile,
} from '../../../types/type';

export const processTs = async (
  content: string,
  originAbsoluteFilePath: string,
  context: IContext,
): Promise<IFile[]> => {
  const result = await transform(
    content,
    {
      sourceMaps: false,
      isModule: true,
      jsc: {
        parser: {
          syntax: 'typescript',
        },
        target: 'es2015',
      },
      module: {
        type: context.options.preserveModuleType,
      },
    },
  );
  const outputAbsoluteFilePath = `${originAbsoluteFilePath}.js`;
  return [
    {
      originAbsoluteFilePath,
      outputAbsoluteFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
