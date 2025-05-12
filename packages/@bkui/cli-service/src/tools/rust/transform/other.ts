import type {
  IFileMap,
  IFile,
} from '../../../types/type';

export const transformOther = (file: IFile, __: IFileMap) => {
  return file.content;
};
