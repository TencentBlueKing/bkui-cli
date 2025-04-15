import type {
  IContext,
} from '../../../types/type';

import {
  transformJsx,
} from '../plugin/transform-jsx';
import path from 'node:path';

export const processTsx = async (content: string, filePath: string, __: IContext) => {
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
  const fileName = path.basename(filePath, path.extname(filePath));
  const outputFilePath = path.join(path.dirname(filePath), `${fileName}.tsx.js`);
  return [
    {
      filePath: outputFilePath,
      content: result.code,
      needProcess: true,
    },
  ];
};
