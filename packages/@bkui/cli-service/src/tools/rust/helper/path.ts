import fs from 'node:fs';

import type {
  IContext,
} from '../../../types/type';

/**
 * 解析文件路径，有一些简写会导致访问不到文件
 * @param filePath 文件路径
 * @returns 解析后的路径
 */
export const resolveFilePath = (filePath: string) => {
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }
  const jsPath = `${filePath}.js`;
  if (fs.existsSync(jsPath)) {
    return jsPath;
  }
  const tsPath = `${filePath}.ts`;
  if (fs.existsSync(tsPath)) {
    return tsPath;
  }
  const tsxPath = `${filePath}.tsx`;
  if (fs.existsSync(tsxPath)) {
    return tsxPath;
  }
  const jsxPath = `${filePath}.jsx`;
  if (fs.existsSync(jsxPath)) {
    return jsxPath;
  }
  const indexJsPath = `${filePath}/index.js`;
  if (fs.existsSync(indexJsPath)) {
    return indexJsPath;
  }
  const indexTsPath = `${filePath}/index.ts`;
  if (fs.existsSync(indexTsPath)) {
    return indexTsPath;
  }
  const indexVuePath = `${filePath}/index.vue`;
  if (fs.existsSync(indexVuePath)) {
    return indexVuePath;
  }
  const indexTsxPath = `${filePath}/index.tsx`;
  if (fs.existsSync(indexTsxPath)) {
    return indexTsxPath;
  }
  const indexJsxPath = `${filePath}/index.jsx`;
  if (fs.existsSync(indexJsxPath)) {
    return indexJsxPath;
  }
  return filePath;
};

/**
 * 解析输出路径
 * @param outputRelativeFilePath 输出路径
 * @param context 上下文
 * @returns 解析后的路径
 */
export const resolveOutputRelativeFilePath = (outputRelativeFilePath: string, context: IContext) => {
  if (outputRelativeFilePath.includes('node_modules')) {
    return outputRelativeFilePath.replace(/.+node_modules\/(.+)/, `./${context.options.outputPreserveModuleDir}/node_modules/$1`);
  }
  return outputRelativeFilePath;
};

/**
 * 判断路径是否是 External 的路径
 * @param filePath 文件路径
 * @param context 上下文
 * @returns 是否匹配
 */
export const isPathMatchExternal = (filePath: string, context: IContext) => {
  const externals = context.options.configureWebpack?.externals || {};
  const externalKeys = Object.keys(externals);
  let isMatch = false;
  externalKeys.forEach((key) => {
    if (key === filePath) {
      isMatch = true;
    }
    if (filePath.startsWith(`${key}/`)) {
      isMatch = true;
    }
  });
  return isMatch;
};
