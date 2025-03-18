const { defineConfig } = require('eslint/config');
const baseConfig = require('./tencent/base');
const vueConfig = require('./tencent/vue');
const prettierConfig = require('./tencent/prettier');

module.exports = defineConfig([baseConfig, vueConfig, prettierConfig]);
