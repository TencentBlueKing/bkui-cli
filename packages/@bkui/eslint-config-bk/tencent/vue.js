const parserVue = require('vue-eslint-parser');
const parserTypeScript = require('@typescript-eslint/parser');
const pluginVue = require('eslint-plugin-vue');

module.exports = [
  {
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
    extends: [pluginVue.configs['flat/recommended']],
    rules: {
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
  },
];
