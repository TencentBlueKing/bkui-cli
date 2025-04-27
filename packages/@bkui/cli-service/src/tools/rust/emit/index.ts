import fs from 'node:fs';
import path from 'node:path';

import type {
  IContext,
} from '../../../types/type';

import {
  fileMap,
} from '../file';

// 输出文件
export const emit = async (context: IContext) => {
  const files = Object.values(fileMap);
  for (const file of files) {
    // 替换 outputRelativeFilePath 中的 context.options.preserveModulesRoot 为 context.options.outputPreserveModuleDir
    const outputFilePath = file.outputRelativeFilePath.replace(
      context.options.preserveModulesRoot,
      context.options.outputPreserveModuleDir,
    );
    // 创建目录
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {
        recursive: true,
      });
    }
    // 写入文件
    fs.writeFileSync(outputFilePath, file.content);
  }
};
