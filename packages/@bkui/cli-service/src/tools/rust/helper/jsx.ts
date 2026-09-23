import {
  getVueVersion,
} from '../../../lib/util';
import type {
  IContext,
} from '../../../types/type';

// 使用 babel transform jsx
export const transformJsx = (content: string, filename: string, context: IContext) => {
  const babel = require('@babel/core');

  const vueVersion = getVueVersion();
  const presets: any[] = [];
  const plugins: any[] = [];

  if (vueVersion === 2) {
    presets.push([require('@vue/babel-preset-jsx'), { compositionAPI: 'auto' }]);
  } else if (vueVersion === 3) {
    plugins.push([require('@vue/babel-plugin-jsx'), { isCustomElement: context.options.vueCompilerOptions.isCustomElement }]);
  }

  return babel.transform(content, {
    filename,
    plugins,
    presets,
  });
};
