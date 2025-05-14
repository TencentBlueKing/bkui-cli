import type {
  IContext,
  IFile,
} from '../../../types/type';

import {
  getAbsolutePath,
} from '../../../lib/util';

import {
  transformPreprocessor,
} from '../helper/preprocessor';


export const processPostcss = async (
  content: string,
  originAbsoluteFilePath: string,
  context: IContext,
): Promise<IFile[]> => {
  const postcssConfig = require(getAbsolutePath(context.workDir, 'postcss.config.js'));
  const options = {
    ...postcssConfig,
    filename: originAbsoluteFilePath,
  };
  const result = transformPreprocessor(content, 'postcss', options);
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
