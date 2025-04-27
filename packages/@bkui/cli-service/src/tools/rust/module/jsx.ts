import path from 'node:path';
import type {
  IContext,
} from '../../../types/type';

import {
  transformJsx,
} from '../helper/jsx';

export const processJsx = async (content: string, originRelativeFilePath: string, __: IContext) => {
  const result = await transformJsx(content);
  const fileName = path.basename(originRelativeFilePath, path.extname(originRelativeFilePath));
  const outputRelativeFilePath = path.join(path.dirname(originRelativeFilePath), `${fileName}.jsx.js`);
  return [
    {
      originRelativeFilePath,
      outputRelativeFilePath,
      content: result.code,
      needProcess: true,
    },
  ];
};
