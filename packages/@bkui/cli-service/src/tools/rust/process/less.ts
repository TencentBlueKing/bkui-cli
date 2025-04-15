import path from 'node:path';

import type {
  IContext,
} from '../../../types/type';

import {
  transformPreprocessor,
} from '../plugin/transfrom-preprocessor';

export const processLess = (source: string, filePath: string, context: IContext) => {
  const filename = path.basename(filePath, path.extname(filePath));
  const options = {
    ...context.options.css?.lessLoaderOptions,
    filename,
  };
  const result = transformPreprocessor(source, 'less', options);
  const outputFilePath = `${filePath}.css`;
  return [
    {
      filePath: outputFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
