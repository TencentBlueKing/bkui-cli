import type {
  IContext,
  IFile,
} from '../../../types/type';

import {
  transformJsx,
} from '../helper/jsx';

export const processJsx = async (
  content: string,
  originAbsoluteFilePath: string,
  context: IContext,
): Promise<IFile[]> => {
  const result = await transformJsx(content, originAbsoluteFilePath, context);
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
