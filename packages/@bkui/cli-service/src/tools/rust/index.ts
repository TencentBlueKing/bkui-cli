import {
  clean,
} from './clean';
import {
  buildModule,
} from './module';
import {
  transform,
} from './transform';
import {
  emit,
} from './emit';

import type {
  IContext,
} from '../../types/type';

// 使用 rust 构建
export const build = async (context: IContext) => {
  const {
    log,
  } = require('@blueking/cli-utils');
  try {
    const startTime = Date.now();
    // clean
    await clean(context);
    // build module
    await buildModule(context);
    // transform
    await transform(context);
    // emit
    await emit(context);
    log.done(`Build preserveModules complete in ${Date.now() - startTime} ms.`);
  } catch (error: any) {
    log.error(error);
    process.exit(1);
  }
};
