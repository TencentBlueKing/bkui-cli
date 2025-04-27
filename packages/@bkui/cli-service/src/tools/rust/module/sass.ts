import type {
  IContext,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../helper/preprocessor';

export const processSass = (source: string, originRelativeFilePath: string, context: IContext) => {
  const options = {
    ...context.options.css?.sassLoaderOptions,
    filename: originRelativeFilePath,
  };
  const result = transformPreprocessor(source, 'sass', options);
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
