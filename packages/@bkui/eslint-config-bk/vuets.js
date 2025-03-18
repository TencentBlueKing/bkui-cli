const { defineConfig } = require('eslint/config');
const tsConfig = require('./tencent/ts');
const vueConfig = require('./tencent/vue');
const baseConfig = require('./tencent/base');
const prettierConfig = require('./tencent/prettier');

const [ts, dts] = tsConfig;

module.exports = defineConfig([
  baseConfig,
  {
    ...ts,
    files: ['**/*.?([cm])ts', '**/*.?([cm])tsx', '**/*.vue'],
  },
  dts,
  vueConfig,
  prettierConfig,
]);
