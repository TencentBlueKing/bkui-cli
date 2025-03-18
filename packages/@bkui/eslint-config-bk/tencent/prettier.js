const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  eslintPluginPrettierRecommended, // 启用eslint-plugin-prettier，使用eslint-config-prettier关闭eslint的冲突规则
];
