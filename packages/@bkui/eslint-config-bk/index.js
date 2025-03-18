const { defineConfig } = require('eslint/config');
const baseConfig = require('./tencent/base');
const prettierConfig = require('./tencent/prettier');

// base
module.exports = defineConfig([baseConfig, prettierConfig]);
