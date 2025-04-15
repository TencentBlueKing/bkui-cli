import type {
  IContext,
} from '../../../types/type';

export const processOther = async (content: string, filePath: string, ___: IContext) => [
  {
    filePath,
    content,
    needProcess: false,
  },
];
