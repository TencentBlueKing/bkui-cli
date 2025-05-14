import type {
  IContext,
  IFile,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../helper/preprocessor';

export const processLess = async (
  content: string,
  originAbsoluteFilePath: string,
  context: IContext,
): Promise<IFile[]> => {
  const options = {
    ...context.options.css?.lessLoaderOptions,
    filename: originAbsoluteFilePath,
  };
  const result = await transformPreprocessor(content, 'less', options);
  const outputAbsoluteFilePath = `${originAbsoluteFilePath}.css`;
  return [
    {
      originAbsoluteFilePath,
      outputAbsoluteFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
