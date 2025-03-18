const { defineConfig } = require('eslint/config');
const { rawTsConfig, rawDTsConfig } = require('./ts');
const { rawVueConfig } = require('./vue');
const baseConfig = require('./index');

module.exports = defineConfig([
  baseConfig,
  {
    ...rawTsConfig,
    files: ['**/*.?([cm])ts', '**/*.?([cm])tsx', '**/*.vue'],
  },
  rawDTsConfig,
  rawVueConfig,
]);
