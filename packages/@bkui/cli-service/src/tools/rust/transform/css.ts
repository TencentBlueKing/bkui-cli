import type {
  IFile,
  IFileMap,
} from '../../../types/type';

import {
  transformDependencies,
} from '../helper/dependency';

export const transformCss = (file: IFile, fileMap: IFileMap) => {
  return transformDependencies(file, fileMap);
};
