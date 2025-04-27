import type {
  ChildNode,
} from 'postcss';
import type {
  IContext,
} from '../../../types/type';

import {
  getCssDependencies,
} from '../helper/dependency';

// 解析
export const parseCss = async (content: string, originRelativeFilePath: string, context: IContext) => {
  const postcss = require('postcss');
  const result = await postcss().process(content);
  const dependencies = getCssDependencies(result.root.nodes as ChildNode[], originRelativeFilePath, context);
  return dependencies;
};
