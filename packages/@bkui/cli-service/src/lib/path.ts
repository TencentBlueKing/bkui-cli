import path from 'node:path';

// 转换路径分隔符为 /
export const normalize = (file: string) => file.replace(/\\/g, '/');

// 解析路径
export const resolve = (...files: string[]) => normalize(path.resolve(...files));

// 连接路径
export const join = (...files: string[]) => normalize(path.join(...files));

// 获取文件目录
export const dirname = (file: string) => path.dirname(file);

// 获取文件扩展名
export const extname = (file: string) => path.extname(file);

// 获取文件名
export const basename = (file: string, suffix?: string) => path.basename(file, suffix);

// 获取相对路径
export const relative = (path1: string, path2: string) => normalize(path.relative(path1, path2));

// 判断是否是绝对路径
export const isAbsolute = (file: string) => path.isAbsolute(file);

// posix
export const posix = {
  join: (...files: string[]) => normalize(path.posix.join(...files)),
};
