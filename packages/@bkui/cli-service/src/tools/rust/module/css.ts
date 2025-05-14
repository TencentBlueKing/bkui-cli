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
export const parseCss = async (content: string, originAbsoluteFilePath: string, context: IContext) => {
  const postcss = require('postcss');
  const result = await postcss().process(content);
  const dependencies = getCssDependencies(result.root.nodes as ChildNode[], originAbsoluteFilePath, context);
  return dependencies;
};
