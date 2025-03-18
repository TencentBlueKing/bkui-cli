const { defineConfig } = require('eslint/config');
const parserVue = require('vue-eslint-parser');
const parserTypeScript = require('@typescript-eslint/parser');
const pluginVue = require('eslint-plugin-vue');
const baseConfig = require('./index');

// 原始vue配置对象
const rawVueConfig = {
  files: ['**/*.vue'],
  languageOptions: {
    parser: parserVue,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      extraFileExtensions: ['.vue'],
      parser: parserTypeScript,
      sourceType: 'module',
    },
  },
  plugins: {
    vue: pluginVue,
  },
  processor: pluginVue.processors['.vue'],
  rules: {
    ...pluginVue.configs['strongly-recommended'].rules,
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/v-on-event-hyphenation': [
      'warn',
      'always',
      {
        autofix: true,
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
};

// 经过defineConfig处理后的vue配置（拍平）
const vueConfig = defineConfig([baseConfig, rawVueConfig]);

module.exports = vueConfig;
module.exports.rawVueConfig = rawVueConfig;
