const { defineConfig } = require('eslint/config');
const parserTypeScript = require('@typescript-eslint/parser');
const pluginTypeScript = require('@typescript-eslint/eslint-plugin');
const baseConfig = require('./index');

// ts配置原始对象
const rawTsConfig = {
  files: ['**/*.?([cm])ts', '**/*.?([cm])tsx'],
  languageOptions: {
    parser: parserTypeScript,
    parserOptions: {
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': pluginTypeScript,
  },
  rules: {
    ...pluginTypeScript.configs.recommended.rules,
    camelcase: 'off',
    'dot-notation': 'off',
    'no-array-constructor': 'off',
    'no-dupe-class-members': 'off',
    'no-empty-function': 'off',
    'no-invalid-this': 'off',
    'no-magic-numbers': 'off',
    'no-undef': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-dupe-class-members': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_.*',
        varsIgnorePattern: '^_.*',
      },
    ],
    '@typescript-eslint/no-useless-constructor': 'warn',
  },
};

const rawDTsConfig = {
  files: ['*.d.ts'],
  rules: {
    'eslint-comments/no-unlimited-disable': 'off',
    'import/no-duplicates': 'off',
    'unused-imports/no-unused-vars': 'off',
  },
};

// 经过defineConfig处理后的ts配置（拍平）
const tsConfig = defineConfig([baseConfig, rawTsConfig, rawDTsConfig]);

module.exports = tsConfig;
module.exports.rawTsConfig = rawTsConfig;
module.exports.rawDTsConfig = rawDTsConfig;
