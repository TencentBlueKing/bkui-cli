// 跨平台构建脚本：清理 dist -> tsc 编译 -> 拷贝 lib-entry.js
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });

const { status } = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc')], {
  cwd: root,
  stdio: 'inherit',
});
if (status !== 0) process.exit(status ?? 1);

fs.copyFileSync(
  path.join(root, 'src/lib/lib-entry.js'),
  path.join(dist, 'lib/lib-entry.js'),
);
