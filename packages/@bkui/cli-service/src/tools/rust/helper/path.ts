import fs from 'node:fs';

import {
  getAbsolutePath,
  getDirName,
  resolveUserPath,
} from '../../../lib/util';

import type {
  IContext,
  IFileDependency,
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
 * @param outputAbsoluteFilePath 输出路径
 * @param context 上下文
 * @returns 解析后的路径
 */
export const resolveOutputAbsoluteFilePath = (outputAbsoluteFilePath: string, context: IContext) => {
  if (outputAbsoluteFilePath.includes('node_modules')) {
    return outputAbsoluteFilePath.replace(
      /.+node_modules\/(.+)/,
      `${context.workDir}/${context.options.preserveModulesRoot ? context.options.preserveModulesRoot : ''}/node_modules/$1`,
    );
  }
  return outputAbsoluteFilePath;
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

/**
 * 获取依赖的绝对路径
 * @param dependencyPath 引入依赖的路径
 * @param originAbsoluteFilePath 引入方的绝对路径
 * @param context 上下文
 * @returns 依赖的绝对路径
 */
export const getAbsoluteDependencyPath = (
  dependencyPath: string,
  originAbsoluteFilePath: string,
  context: IContext,
) => {
  let toPath = dependencyPath;

  const aliasMap = {
    '@': getAbsolutePath(context.workDir, 'src'),
  };

  // 用户配置的 alias
  Object.keys(context.options.configureWebpack?.resolve?.alias || {}).forEach((key) => {
    aliasMap[key] = resolveUserPath(context.workDir, context.options.configureWebpack!.resolve!.alias![key]);
  });

  // 遍历 aliasMap 替换路径
  Object.keys(aliasMap).forEach((key) => {
    // 命中别名
    if (toPath.startsWith(key)) {
      toPath = toPath.replace(key, aliasMap[key]);
    }
  });

  return resolveUserPath(getDirName(originAbsoluteFilePath), toPath);
};

/**
 * 获取依赖的参数
 * @param dependency 依赖
 * @returns 参数
 */
export const getDependencyQueryAndHash = (dependency: IFileDependency) => {
  let queryAndHash = '';
  if (dependency.query) {
    queryAndHash += `?${dependency.query}`;
  }

  if (dependency.hash) {
    queryAndHash += `#${dependency.hash}`;
  }

  return queryAndHash;
};

/**
 * 解析依赖参数
 * @param originDependencyPath 原始引用路径
 * @returns 引用参数
 */
export const parseDependencyQueryAndHash = (originDependencyPath: string) => {
  let hash = '';
  let query = '';
  let dependencyPath = originDependencyPath;
  if (dependencyPath.includes('#')) {
    [dependencyPath, hash] = dependencyPath.split('#');
  }
  if (dependencyPath.includes('?')) {
    [dependencyPath, query] = dependencyPath.split('?');
  }

  return {
    dependencyPath,
    hash,
    query,
  };
};
