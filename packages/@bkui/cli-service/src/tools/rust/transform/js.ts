import {
  transformDependencies,
} from '../helper/dependency';

import type {
  IFile,
  IFileMap,
} from '../../../types/type';

export const transformJs = (file: IFile, fileMap: IFileMap) => {
  return transformDependencies(file, fileMap);
};
