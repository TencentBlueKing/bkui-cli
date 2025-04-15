import {
  transform,
} from '@swc/core';
import type {
  IContext,
} from '../../../types/type';
import path from 'node:path';
import {
  TransformImportPlugin,
} from '../plugin/transform-import';

export const processTs = async (content: string, filePath: string, context: IContext) => {
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
      plugin: TransformImportPlugin(context, filePath),
    },
  );
  const outputFilePath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.js`);
  return [
    {
      filePath: outputFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
