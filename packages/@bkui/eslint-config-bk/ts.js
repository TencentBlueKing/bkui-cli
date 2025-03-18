const { defineConfig } = require('eslint/config');
const baseConfig = require('./tencent/base');
const tsConfig = require('./tencent/ts');
const prettierConfig = require('./tencent/prettier');

module.exports = defineConfig([baseConfig, tsConfig, prettierConfig]);
