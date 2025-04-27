import type {
  IContext,
} from '../../../types/type';

import {
  getAbsolutePath,
} from '../../../lib/util';

import {
  transformPreprocessor,
} from '../helper/preprocessor';


export const processPostcss = (source: string, originRelativeFilePath: string, context: IContext) => {
  const postcssConfig = require(getAbsolutePath(context.workDir, 'postcss.config.js'));
  const options = {
    ...postcssConfig,
    filename: originRelativeFilePath,
  };
  const result = transformPreprocessor(source, 'postcss', options);
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
