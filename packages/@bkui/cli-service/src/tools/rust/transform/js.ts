import {
  transformDependencies,
} from '../helper/dependency';

import type {
  IFile,
} from '../../../types/type';

export const transformJs = (file: IFile) => {
  return transformDependencies(file);
};
