import path from 'node:path';

import type {
  IContext,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../plugin/transfrom-preprocessor';

export const processStyl = (source: string, filePath: string, context: IContext) => {
  const options = {
    ...context.options.css?.stylusLoaderOptions,
    filename: path.basename(filePath, path.extname(filePath)),
  };
  const result = transformPreprocessor(source, 'styl', options);
  const outputFilePath = `${filePath}.css`;
  return [
    {
      filePath: outputFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
