import fs from 'node:fs';

import type {
  IContext,
} from '../../../types/type';

import {
  getAbsolutePath,
} from '../../../lib/util';

// 清理输出目录
export const clean = (context: IContext) => {
  const {
    clean,
    outputPreserveModuleDir,
  } = context.options;
  if (clean) {
    const outputDir = getAbsolutePath(context.workDir, outputPreserveModuleDir);
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
  }
};
