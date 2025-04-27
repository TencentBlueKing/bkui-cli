import type {
  IContext,
  IFile,
} from '../../../types/type';

export const transformOther = (file: IFile, __: IContext) => {
  return file.content;
};
