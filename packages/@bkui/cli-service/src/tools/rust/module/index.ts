import fs from 'node:fs';

import {
  getAbsolutePath,
} from '../../../lib/util';
import {
  extname,
} from '../../../lib/path';

import {
  processJs,
  parseJs,
} from './js';
import {
  processTs,
} from './ts';
import {
  processTsx,
} from './tsx';
import {
  processVue,
} from './vue';
import {
  processJsx,
} from './jsx';
import {
  processOther,
  parseOther,
} from './other';
import {
  processSass,
} from './sass';
import {
  processScss,
} from './scss';
import {
  processLess,
} from './less';
import {
  processStyl,
} from './styl';
import {
  processStylus,
} from './stylus';
import {
  processPostcss,
} from './postcss';
import {
  parseCss,
} from './css';

import type {
  IContext,
  IFileMap,
} from '../../../types/type';

// 获取文件处理函数
const getFileProcess = (relativeFilePath: string): typeof processJs => {
  const processMap = {
    '.js': processJs,
    '.cjs': processJs,
    '.mjs': processJs,
    '.ts': processTs,
    '.tsx': processTsx,
    '.vue': processVue,
    '.jsx': processJsx,
    '.sass': processSass,
    '.scss': processScss,
    '.less': processLess,
    '.styl': processStyl,
    '.stylus': processStylus,
    '.postcss': processPostcss,
  };
  const fileExt = extname(relativeFilePath);
  return processMap[fileExt] || processOther;
};

// 获取文件解析函数
const getFileParse = (relativeFilePath: string): typeof parseJs => {
  const parseMap = {
    '.js': parseJs,
    '.cjs': parseJs,
    '.mjs': parseJs,
    '.css': parseCss,
  };
  const fileExt = extname(relativeFilePath);
  return parseMap[fileExt] || parseOther;
};

// 处理单个文件
const build = async (originAbsoluteFilePath: string, fileMap: IFileMap, context: IContext) => {
  // 1. 构建单文件
  // 如果文件已经处理过，则跳过
  if (fileMap[originAbsoluteFilePath]) return;
  // 先获取文件内容
  const content = fs.readFileSync(originAbsoluteFilePath, 'utf-8');
  // 第一次处理文件内容
  const processedFiles = await getFileProcess(originAbsoluteFilePath)(content, originAbsoluteFilePath, context);
  // 如果还有需要处理的文件，则循环处理
  while (processedFiles.some(file => file.needProcess)) {
    for (const processedFile of processedFiles) {
      const { needProcess, originAbsoluteFilePath, outputAbsoluteFilePath, content } = processedFile;
      if (needProcess) {
        // 删除当前文件
        processedFiles.splice(processedFiles.indexOf(processedFile), 1);
        // 添加新文件
        processedFiles.push(...await getFileProcess(outputAbsoluteFilePath)(content, originAbsoluteFilePath, context));
      }
    }
  }
  // 2. 构建 fileMap 对象
  // 将处理后的文件添加到 fileMap 中
  processedFiles.forEach((file) => {
    fileMap[file.originAbsoluteFilePath] = file;
  });
  // 3. 构建依赖文件
  // 获取构建后的 file
  for (const file of processedFiles) {
    const fileParse = getFileParse(file.outputAbsoluteFilePath);
    const dependencies = await fileParse(file.content, file.originAbsoluteFilePath, context);
    file.dependencies = dependencies;
    // 递归构建依赖文件
    for (const dependency of dependencies) {
      await build(dependency.originAbsoluteDependencyPath, fileMap, context);
    }
  }
};

// 执行转换
export const buildModule = async (fileMap: IFileMap, context: IContext) => {
  // 获取 entry 的文件列表
  const entries = Object
    .values(context.options.resource)
    .reduce(
      (acc, cur) => {
        const items = Array.isArray(cur.entry) ? cur.entry : [cur.entry];
        acc.push(...items);
        return acc;
      },
      [] as string[],
    );
  return Promise.all(entries.map(entry => build(getAbsolutePath(context.workDir, entry), fileMap, context)));
};
