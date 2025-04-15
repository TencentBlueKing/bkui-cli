import path from 'node:path';

import type {
  IContext,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../plugin/transfrom-preprocessor';

export const processScss = (source: string, filePath: string, context: IContext) => {
  const options = {
    ...context.options.css?.sassLoaderOptions,
    filename: path.basename(filePath, path.extname(filePath)),
  };
  const result = transformPreprocessor(source, 'scss', options);
  const outputFilePath = `${filePath}.css`;
  return [
    {
      filePath: outputFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
