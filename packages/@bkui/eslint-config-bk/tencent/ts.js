/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 Tencent. All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
const parserTypeScript = require('@typescript-eslint/parser');
const pluginTypeScript = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
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
  },
  {
    files: ['*.d.ts'],
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
      'import/no-duplicates': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
];
