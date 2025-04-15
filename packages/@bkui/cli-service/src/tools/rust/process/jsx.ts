import path from 'node:path';
import type {
  IContext,
} from '../../../types/type';

import {
  transformJsx,
} from '../plugin/transform-jsx';

export const processJsx = async (content: string, filePath: string, __: IContext) => {
  const result = await transformJsx(content);
  const fileName = path.basename(filePath, path.extname(filePath));
  const outputFilePath = path.join(path.dirname(filePath), `${fileName}.jsx.js`);
  return [
    {
      filePath: outputFilePath,
      content: result.code,
      needProcess: true,
    },
  ];
};
