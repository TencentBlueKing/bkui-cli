import fs from 'node:fs';

import type {
  IContext,
  IFileMap,
} from '../../../types/type';
import {
  getAbsolutePath,
} from '../../../lib/util';
import {
  dirname,
} from '../../../lib/path';

// 输出文件
export const emit = (fileMap: IFileMap, context: IContext) => {
  const files = Object.values(fileMap);
  const absolutePreserveModuleRoot = getAbsolutePath(context.workDir, context.options.preserveModulesRoot);
  const absoluteOutputPreserveModuleDir = getAbsolutePath(context.workDir, context.options.outputPreserveModuleDir);
  const tasks: Array<Promise<void>> = files.map(async (file) => {
    // 替换 outputRelativeFilePath 中的 context.options.preserveModulesRoot 为 context.options.outputPreserveModuleDir
    const outputFilePath = file.outputAbsoluteFilePath.replace(
      absolutePreserveModuleRoot,
      absoluteOutputPreserveModuleDir,
    );
    // 创建目录
    const outputDir = dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {
        recursive: true,
      });
    }
    // 写入文件
    if (file.keepOriginFile) {
      fs.cpSync(file.originAbsoluteFilePath, outputFilePath);
    } else {
      fs.writeFileSync(outputFilePath, file.content);
    }
  });
  return Promise.all(tasks);
};
