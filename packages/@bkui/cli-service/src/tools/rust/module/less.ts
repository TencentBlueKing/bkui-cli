import type {
  IContext,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../helper/preprocessor';

export const processLess = async (source: string, originRelativeFilePath: string, context: IContext) => {
  const options = {
    ...context.options.css?.lessLoaderOptions,
    filename: originRelativeFilePath,
  };
  const result = await transformPreprocessor(source, 'less', options);
  const outputRelativeFilePath = `${originRelativeFilePath}.css`;
  return [
    {
      originRelativeFilePath,
      outputRelativeFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
