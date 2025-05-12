import {
  transform,
  parse,
} from '@swc/core';
import type {
  IContext,
  IFile,
} from '../../../types/type';

import {
  getJsDependencies,
} from '../helper/dependency';

import {
  resolveOutputRelativeFilePath,
} from '../helper/path';

// 转义
export const processJs = async (
  content: string,
  originRelativeFilePath: string,
  context: IContext,
): Promise<IFile[]> => {
  const result = !originRelativeFilePath.includes('node_modules')
    ? await transform(
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
        module: {
          type: context.options.preserveModuleType,
        },
      },
    )
    : {
      code: content,
    };
  // 原始文件是js的，输出可以不改名字。
  const outputRelativeFilePath = resolveOutputRelativeFilePath(
    originRelativeFilePath.endsWith('.js')
      ? originRelativeFilePath
      : `${originRelativeFilePath}.js`,
    context,
  );
  return [
    {
      originRelativeFilePath,
      outputRelativeFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};

// 解析
export const parseJs = async (content: string, originRelativeFilePath: string, context: IContext) => {
  const result = await parse(content);
  const dependencies = getJsDependencies(result, originRelativeFilePath, context);
  return dependencies;
};
