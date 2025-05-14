import type {
  IContext,
  IFile,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../helper/preprocessor';

export const processSass = async (
  content: string,
  originAbsoluteFilePath: string,
  context: IContext,
): Promise<IFile[]> => {
  const options = {
    ...context.options.css?.sassLoaderOptions,
    filename: originAbsoluteFilePath,
  };
  const result = transformPreprocessor(content, 'sass', options);
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
