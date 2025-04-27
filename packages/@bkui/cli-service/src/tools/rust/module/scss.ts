import type {
  IContext,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../helper/preprocessor';

export const processScss = (source: string, originRelativeFilePath: string, context: IContext) => {
  const options = {
    ...context.options.css?.sassLoaderOptions,
    filename: originRelativeFilePath,
  };
  const result = transformPreprocessor(source, 'scss', options);
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
