import path from 'node:path';

import type {
  IContext,
} from '../../../types/type';

import {
  getAbsolutePath,
} from '../../../lib/util';

import {
  transformPreprocessor,
} from '../plugin/transfrom-preprocessor';


export const processPostcss = (source: string, filePath: string, context: IContext) => {
  const postcssConfig = require(getAbsolutePath(context.workDir, 'postcss.config.js'));
  const options = {
    ...postcssConfig,
    filename: path.basename(filePath, path.extname(filePath)),
  };
  const result = transformPreprocessor(source, 'postcss', options);
  const outputFilePath = `${filePath}.css`;
  return [
    {
      filePath: outputFilePath,
      content: result.code,
      needProcess: false,
    },
  ];
};
