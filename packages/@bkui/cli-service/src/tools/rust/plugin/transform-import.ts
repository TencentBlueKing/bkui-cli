import type {
  CallExpression,
  Identifier,
  ModuleItem,
  Program,
  Statement,
  StringLiteral,
} from '@swc/core';
import path from 'node:path';
import type {
  IContext,
} from '../../../types/type';
import {
  getAbsolutePath,
  getRelativePath,
} from '../../../lib/util';

// 文件扩展名映射
const EXT_MAP = {
  '.vue': '.vue.js',
  '.tsx': '.tsx.js',
  '.ts': '.js',
  '.jsx': '.jsx.js',
  '.styl': '.styl.css',
  '.stylus': '.stylus.css',
  '.scss': '.scss.css',
  '.sass': '.sass.css',
  '.less': '.less.css',
  '.postcss': '.postcss.css',
};

export const TransformImportPlugin = (context: IContext, filePath: string) => (program: Program) => {
  const transformImportPath = (source: StringLiteral) => {
    const ext = path.extname(source.value);
    if (EXT_MAP[ext]) {
      source.value = source.value.replace(
        new RegExp(`${ext}$`),
        EXT_MAP[ext],
      );
      source.raw = `'${source.value}'`;
    }
  };

  const transfromImportAlias = (source: StringLiteral) => {
    // 默认 @ -> src
    const aliasMap = {
      '@': getAbsolutePath(context.workDir, 'src'),
    };

    // 用户配置的 alias
    Object.keys(context.options.configureWebpack?.resolve?.alias || {}).forEach((key) => {
      aliasMap[key] = context.options.configureWebpack!.resolve!.alias![key];
    });

    // 遍历 aliasMap 替换 import 路径
    Object.keys(aliasMap).forEach((key) => {
      // 命中别名
      if (source.value.startsWith(key)) {
        const relativePath = getRelativePath(path.dirname(filePath), aliasMap[key]);
        source.value = source.value.replace(key, relativePath);
      }
    });
  };

  const visitNode = (node: ModuleItem | Statement | CallExpression) => {
    if (!node || typeof node !== 'object') return;

    // 直接 import
    if (node.type === 'ImportDeclaration') {
      if (node.source.type === 'StringLiteral') {
        transfromImportAlias(node.source);
        transformImportPath(node.source);
      }
    }

    // 动态 import
    if (node.type === 'CallExpression' && node.callee.type === 'Import') {
      transfromImportAlias(node.arguments[0].expression as StringLiteral);
      transformImportPath(node.arguments[0].expression as StringLiteral);
    }

    // require
    if (
      node.type === 'CallExpression'
      && node.callee.type === 'Identifier'
      && (node.callee as Identifier).value === 'require'
    ) {
      transfromImportAlias(node.arguments[0].expression as StringLiteral);
      transformImportPath(node.arguments[0].expression as StringLiteral);
    }

    // 递归处理所有属性
    Object.keys(node).forEach((key) => {
      const value = node[key];
      if (Array.isArray(value)) {
        value.forEach(item => visitNode(item));
      } else if (typeof value === 'object' && value !== null) {
        visitNode(value);
      }
    });
  };

  // 遍历所有节点
  program.body.forEach(visitNode);

  return program;
};
