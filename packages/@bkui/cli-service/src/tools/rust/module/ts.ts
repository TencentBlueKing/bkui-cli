import {
  transform,
} from '@swc/core';
import type {
  IContext,
} from '../../../types/type';
import path from 'node:path';

export const processTs = async (content: string, originRelativeFilePath: string, context: IContext) => {
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
  const outputRelativeFilePath = path.join(path.dirname(originRelativeFilePath), `${path.basename(originRelativeFilePath, path.extname(originRelativeFilePath))}.js`);
  return [
    {
      originRelativeFilePath,
      outputRelativeFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
