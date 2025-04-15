import {
  transform,
} from '@swc/core';
import type {
  IContext,
} from '../../../types/type';
import {
  TransformImportPlugin,
} from '../plugin/transform-import';

export const processJs = async (content: string, filePath: string, context: IContext) => {
  const result = await transform(
    content,
    {
      sourceMaps: false,
      isModule: true,
      jsc: {
        parser: {
          syntax: 'ecmascript',
        },
        target: 'es2015',
      },
      plugin: TransformImportPlugin(context, filePath),
    },
  );
  return [
    {
      filePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
