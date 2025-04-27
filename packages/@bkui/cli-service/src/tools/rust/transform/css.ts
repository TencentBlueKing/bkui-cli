import type {
  IFile,
} from '../../../types/type';

import {
  transformDependencies,
} from '../helper/dependency';

export const transformCss = (file: IFile) => {
  return transformDependencies(file);
};
