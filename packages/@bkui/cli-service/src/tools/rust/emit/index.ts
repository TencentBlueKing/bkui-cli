import fs from 'node:fs';
import path from 'node:path';

import type {
  IContext,
  IFileMap,
} from '../../../types/type';
import {
  getAbsolutePath,
} from '../../../lib/util';

// 输出文件
export const emit = async (fileMap: IFileMap, context: IContext) => {
  const files = Object.values(fileMap);
  const absolutePreserveModuleRoot = getAbsolutePath(context.workDir, context.options.preserveModulesRoot);
  const absoluteOutputPreserveModuleDir = getAbsolutePath(context.workDir, context.options.outputPreserveModuleDir);
  for (const file of files) {
    // 替换 outputRelativeFilePath 中的 context.options.preserveModulesRoot 为 context.options.outputPreserveModuleDir
    const outputFilePath = file.outputAbsoluteFilePath.replace(
      absolutePreserveModuleRoot,
      absoluteOutputPreserveModuleDir,
    );
    // 创建目录
    const outputDir = path.dirname(outputFilePath);
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
  }
};
