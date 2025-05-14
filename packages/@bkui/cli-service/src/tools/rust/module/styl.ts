import type {
  IContext,
  IFile,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../helper/preprocessor';

export const processStyl = async (
  source: string,
  originAbsoluteFilePath: string,
  context: IContext,
): Promise<IFile[]> => {
  const options = {
    ...context.options.css?.stylusLoaderOptions,
    filename: originAbsoluteFilePath,
  };
  const result = transformPreprocessor(source, 'styl', options);
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
