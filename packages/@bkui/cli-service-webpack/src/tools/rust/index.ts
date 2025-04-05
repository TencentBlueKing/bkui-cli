import type {
  IContext,
} from '../../types/type';

// 使用 rust 构建
export const build = (context: IContext) => {
  console.log('buildRust', context, '====');
};
