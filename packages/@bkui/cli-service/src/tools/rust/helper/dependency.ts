import {
  getRelativePath,
  getDirName,
  isNodeBuiltInModule,
} from '../../../lib/util';
import {
  getAbsoluteDependencyPath,
  getDependencyQueryAndHash,
  parseDependencyQueryAndHash,
  resolveFilePath,
  isPathMatchExternal,
} from './path';

import type {
  CallExpression,
  Identifier,
  ModuleItem,
  Program,
  Statement,
  StringLiteral,
} from '@swc/core';
import type {
  ChildNode,
} from 'postcss';

import type {
  IContext,
  IFile,
  IFileMap,
  IFileDependency,
} from '../../../types/type';

/**
 * 遍历 js 的 ast 节点
 * @param node js 的 ast 节点
 * @param callback 回调函数
 * @returns null
 */
const visitJSNode = (
  node: ModuleItem | Statement | CallExpression,
  callback: (node: StringLiteral) => void,
) => {
  if (!node || typeof node !== 'object') return;

  // 直接 import
  if (node.type === 'ImportDeclaration') {
    if (node.source?.type === 'StringLiteral') {
      callback(node.source);
    }
  }

  // export * from 'xxx' 或 export { x } from 'xxx'
  if (node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') {
    if (node.source?.type === 'StringLiteral') {
      callback(node.source);
    }
  }

  // 动态 import
  if (node.type === 'CallExpression' && node.callee.type === 'Import') {
    callback(node.arguments[0].expression as StringLiteral);
  }

  // require
  if (
    node.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && (node.callee as Identifier).value === 'require'
    && node.arguments[0].expression.type === 'StringLiteral'
  ) {
    callback(node.arguments[0].expression as StringLiteral);
  }

  // 递归处理所有属性
  Object.keys(node).forEach((key) => {
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach(item => visitJSNode(item, callback));
    } else if (typeof value === 'object' && value !== null) {
      visitJSNode(value, callback);
    }
  });
};

/**
 * 获取依赖路径
 * @param dependency 依赖
 * @param originAbsoluteFilePath 原始绝对路径
 * @param context 上下文
 * @returns 依赖绝对路径
 */
const getDependency = (
  originDependencyPath: string,
  originAbsoluteFilePath: string,
  context: IContext,
): IFileDependency | null => {
  // 空字符串不构建
  if (!originDependencyPath) return null;

  // external 的依赖不构建
  if (isPathMatchExternal(originDependencyPath, context)) return null;

  // node 内置模块也不构建
  if (isNodeBuiltInModule(originDependencyPath)) return null;

  // 1. 构造 dependency
  const dependency: IFileDependency = {
    originDependencyPath,
    originAbsoluteDependencyPath: '',
  };

  // 2. 解析 query 和 hash
  const {
    dependencyPath,
    hash,
    query,
  } = parseDependencyQueryAndHash(dependency.originDependencyPath);
  if (hash) {
    dependency.hash = hash;
  }
  if (query) {
    dependency.query = query;
  }

  // 3. 生成 originAbsoluteDependencyPath
  // 处理 node_modules 的依赖
  try {
    const originAbsoluteDependencyPath = require.resolve(dependencyPath);
    if (originAbsoluteDependencyPath.includes('node_modules')) {
      dependency.originAbsoluteDependencyPath = resolveFilePath(originAbsoluteDependencyPath);
      return dependency;
    }
  } catch (error) {

  }
  // 处理自己项目中的依赖
  dependency.originAbsoluteDependencyPath = resolveFilePath(
    getAbsoluteDependencyPath(dependencyPath, originAbsoluteFilePath, context),
  );
  return dependency;
};

/**
 * 获取js依赖路径
 * @param program 程序
 * @param originAbsoluteFilePath 原始文件绝对路径
 * @param context 上下文
 * @returns 依赖路径
 */
export const getJsDependencies = (program: Program, originAbsoluteFilePath: string, context: IContext) => {
  // 依赖路径
  const dependencies: IFile['dependencies'] = [];

  // 找到引入路径，转换成相对路径
  const handleVisitImportNode = (node: StringLiteral) => {
    const originDependencyPath = node.value;
    const dependency = getDependency(originDependencyPath, originAbsoluteFilePath, context);
    if (dependency) {
      dependencies.push(dependency);
    }
  };

  // 遍历所有节点
  program.body.forEach((node) => {
    visitJSNode(node, handleVisitImportNode);
  });

  return dependencies;
};

/**
 * 获取css依赖路径
 * @param nodes 节点
 * @param originAbsoluteFilePath 原始绝对路径
 * @param context 上下文
 * @returns 依赖路径
 */
export const getCssDependencies = (nodes: ChildNode[], originAbsoluteFilePath: string, context: IContext) => {
  const dependencies: IFile['dependencies'] = [];

  nodes.forEach((node) => {
    // 处理 @import 规则
    if (node.type === 'atrule' && node.name === 'import') {
      const originDependencyPath = node.params.slice(1, -1);
      const dependency = getDependency(originDependencyPath, originAbsoluteFilePath, context);
      if (dependency) {
        dependencies.push(dependency);
      }
    }

    // 处理普通规则中的 url
    if (node.type === 'rule' || (node.type === 'atrule' && node.name === 'font-face')) {
      node.walkDecls((decl) => {
        const { value } = decl;
        // 匹配 url() 和 url('') 和 url("") 的情况
        const urlRegex = /url\(['"]?([^'"()]+)['"]?\)/g;
        let match;

        while ((match = urlRegex.exec(value)) !== null) {
          const originDependencyPath = match[1].trim();
          // 排除数据 URL 和 http(s) 链接
          if (originDependencyPath.startsWith('data:') || originDependencyPath.startsWith('http')) {
            continue;
          }

          const dependency = getDependency(originDependencyPath, originAbsoluteFilePath, context);
          if (dependency) {
            dependencies.push(dependency);
          }
        }
      });
    }
  });

  return dependencies;
};

/**
 * 转换依赖路径
 * @param file 文件
 * @param fileMap 文件列表
 * @returns 依赖路径
 */
export const transformDependencies = (file: IFile, fileMap: IFileMap) => {
  let { content } = file;
  file.dependencies?.forEach((dependency) => {
    const {
      originDependencyPath,
      originAbsoluteDependencyPath,
    } = dependency;
    const dependencyFile = fileMap[originAbsoluteDependencyPath];
    const dependencyPath = `'${getRelativePath(getDirName(file.outputAbsoluteFilePath), dependencyFile.outputAbsoluteFilePath)}'`;
    const dependencyQueryHash = getDependencyQueryAndHash(dependency);
    const relativeDependencyPath = dependencyPath + dependencyQueryHash;

    // 替换普通引号包裹的路径（如 import 和 require）
    const pathReg = new RegExp(`'${originDependencyPath}'`, 'g');
    content = content.replace(pathReg, relativeDependencyPath);

    // 替换双引号包裹的路径
    const doubleQuotePathReg = new RegExp(`"${originDependencyPath}"`, 'g');
    content = content.replace(doubleQuotePathReg, relativeDependencyPath);

    // 替换 CSS 中 url() 引用
    const urlPathReg = new RegExp(`url\\(['"]?${originDependencyPath}['"]?\\)`, 'g');
    const urlRelativePath = `url(${relativeDependencyPath.substring(1, relativeDependencyPath.length - 1)})`;
    content = content.replace(urlPathReg, urlRelativePath);
  });
  return content;
};
