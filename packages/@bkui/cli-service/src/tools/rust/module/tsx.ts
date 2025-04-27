import type {
  IContext,
} from '../../../types/type';

import {
  transformJsx,
} from '../helper/jsx';
import path from 'node:path';

export const processTsx = async (content: string, originRelativeFilePath: string, __: IContext) => {
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
  const fileName = path.basename(originRelativeFilePath, path.extname(originRelativeFilePath));
  const outputRelativeFilePath = path.join(path.dirname(originRelativeFilePath), `${fileName}.tsx.js`);
  return [
    {
      originRelativeFilePath,
      outputRelativeFilePath,
      content: result.code,
      needProcess: true,
    },
  ];
};
