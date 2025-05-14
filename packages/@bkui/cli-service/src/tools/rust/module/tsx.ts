import type {
  IContext,
  IFile,
} from '../../../types/type';

import {
  transformJsx,
} from '../helper/jsx';

export const processTsx = async (
  content: string,
  originAbsoluteFilePath: string,
  __: IContext,
): Promise<IFile[]> => {
  // 先转义 ts
  const ts = require('typescript');
  const tsTranspileResult = ts.transpileModule(content, {
    compilerOptions: {
      target: 'es2015',
      jsx: ts.JsxEmit.Preserve,
    },
  });
  // 再转义 jsx
  const result = await transformJsx(tsTranspileResult.outputText);
  const outputAbsoluteFilePath = `${originAbsoluteFilePath}.js`;
  return [
    {
      originAbsoluteFilePath,
      outputAbsoluteFilePath,
      content: result.code,
      needProcess: true,
    },
  ];
};
