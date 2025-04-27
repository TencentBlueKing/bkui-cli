import {
  getVueVersion,
} from '../../../lib/util';

// 使用 babel transform jsx
export const transformJsx = (content: string) => {
  const babel = require('@babel/core');

  const vueVersion = getVueVersion();
  const presets: any[] = [];
  const plugins: any[] = [];

  if (vueVersion === 2) {
    presets.push([require('@vue/babel-preset-jsx'), { compositionAPI: 'auto' }]);
  } else if (vueVersion === 3) {
    plugins.push([require('@vue/babel-plugin-jsx')]);
  }

  return babel.transform(content, {
    plugins,
    presets,
  });
};
