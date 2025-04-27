import type {
  IContext,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../helper/preprocessor';

export const processStyl = (source: string, originRelativeFilePath: string, context: IContext) => {
  const options = {
    ...context.options.css?.stylusLoaderOptions,
    filename: originRelativeFilePath,
  };
  const result = transformPreprocessor(source, 'styl', options);
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
