import fs from 'node:fs';
import path from 'node:path';

import type {
  IContext,
  IOptions,
  FileProcessHandler,
} from '../../types/type';

import {
  getAbsolutePath,
} from '../../lib/util';
import {
  processJs,
} from './process/js';
import {
  processTs,
} from './process/ts';
import {
  processTsx,
} from './process/tsx';
import {
  processVue,
} from './process/vue';
import {
  processJsx,
} from './process/jsx';
import {
  processOther,
} from './process/other';
import {
  processSass,
} from './process/sass';
import {
  processScss,
} from './process/scss';
import {
  processLess,
} from './process/less';
import {
  processStyl,
} from './process/styl';
import {
  processStylus,
} from './process/stylus';
import {
  processPostcss,
} from './process/postcss';

// 清理输出目录
const cleanOutputPreserveModuleDir = (workDir: string, options: IOptions) => {
  const {
    clean,
    outputPreserveModuleDir,
  } = options;
  if (clean) {
    const outputDir = getAbsolutePath(workDir, outputPreserveModuleDir);
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
  }
};

const isFilePathExclude = (filePath: string) => {
  const excludePaths = ['node_modules', 'dist', 'build', '.d.ts', '__test__', '__demo__'];
  for (const excludePath of excludePaths) {
    if (filePath.includes(excludePath)) {
      return true;
    }
  }
  return false;
};

// 获取文件处理函数
const getFileProcess = (filePath: string): FileProcessHandler => {
  const processMap = {
    '.js': processJs,
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
  const fileExt = path.extname(filePath);
  return processMap[fileExt] || processOther;
};

// 获取文件输出路径
const getFileOutputPath = (filePath: string, context: IContext) => {
  const {
    outputPreserveModuleDir,
    preserveModulesRoot,
  } = context.options;
  // from preserveModulesRoot to outputPreserveModuleDir
  return filePath.replace(preserveModulesRoot, outputPreserveModuleDir);
};

// 处理path下的文件，根据文件类型进行处理
const transform = async (filePath: string, context: IContext) => {
  if (isFilePathExclude(filePath)) return;

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    // 创建目录
    const outputFilePath = getFileOutputPath(filePath, context);
    if (!fs.existsSync(outputFilePath)) {
      fs.mkdirSync(outputFilePath, { recursive: true });
    }
    // 递归处理子文件
    const files = fs.readdirSync(filePath);
    for (const file of files) {
      const childFilePath = path.join(filePath, file);
      await transform(childFilePath, context);
    }
  } else {
    const content = fs.readFileSync(filePath, 'utf-8');
    // 递归编译文件
    const processResults: Awaited<ReturnType<FileProcessHandler>> = [];
    processResults.push(...await getFileProcess(filePath)(content, filePath, context));
    while (processResults.some(processResults => processResults?.needProcess)) {
      for (const processResult of processResults) {
        // 需要进一步编译
        if (processResult?.needProcess) {
          const {
            filePath,
            content,
          } = processResult;
          // 移除当前文件
          processResults.splice(processResults.indexOf(processResult), 1);
          // 添加新的文件
          processResults.push(...await getFileProcess(filePath)(content, filePath, context));
        }
      }
    };
    // 写入文件
    for (const processResult of processResults) {
      // 如果文件不存在，则跳过
      if (!processResult) continue;
      // 写入文件
      const {
        filePath,
        content,
      } = processResult;
      const outputFilePath = getFileOutputPath(filePath, context);
      fs.writeFileSync(outputFilePath, content);
    }
  }
};

// 使用 rust 构建
export const build = async (context: IContext) => {
  const {
    log,
  } = require('@blueking/cli-utils');
  try {
    const startTime = Date.now();
    // clean output dir
    await cleanOutputPreserveModuleDir(context.workDir, context.options);
    // transfrom
    await transform(context.options.preserveModulesRoot, context);
    log.done(`Build preserveModules complete in ${Date.now() - startTime} ms.`);
  } catch (error: any) {
    log.error(error);
    process.exit(1);
  }
};
