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
import stylistic from '@stylistic/eslint-plugin';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserTypeScript from '@typescript-eslint/parser';

const stylisticRules = {
  '@stylistic/brace-style': 'error', // 大括号风格
  '@stylistic/comma-spacing': ['error', { before: false, after: true }], // 逗号空格
  '@stylistic/function-call-spacing': ['error', 'never'], // 函数调用括号前空格
  '@stylistic/indent': [
    'warn',
    2,
    {
      SwitchCase: 1,
      VariableDeclarator: 1,
      outerIIFEBody: 1,
      FunctionDeclaration: { parameters: 1, body: 1 },
      FunctionExpression: { parameters: 1, body: 1 },
      CallExpression: { arguments: 1 },
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      ignoredNodes: [
        'JSXElement',
        'JSXElement > *',
        'JSXAttribute',
        'JSXIdentifier',
        'JSXNamespacedName',
        'JSXMemberExpression',
        'JSXSpreadAttribute',
        'JSXExpressionContainer',
        'JSXOpeningElement',
        'JSXClosingElement',
        'JSXFragment',
        'JSXOpeningFragment',
        'JSXClosingFragment',
        'JSXText',
        'JSXEmptyExpression',
        'JSXSpreadChild',
      ],
      ignoreComments: false,
    },
  ], // 缩进
  '@stylistic/keyword-spacing': [
    'error',
    {
      overrides: {
        if: { after: true },
        for: { after: true },
        while: { after: true },
        else: { after: true },
      },
      before: true,
      after: true,
    },
  ], // 关键字空格
  '@stylistic/quotes': ['warn', 'single', { allowTemplateLiterals: false }], // 字符串引号
  '@stylistic/semi': ['error', 'always'], // 分号
  '@stylistic/space-before-function-paren': [
    'error',
    { anonymous: 'always', named: 'never', asyncArrow: 'always' },
  ], // 函数括号前空格
  '@stylistic/type-annotation-spacing': 'error', // 类型注解空格
};

const tsRules = {
  // https://typescript-eslint.io/rules/adjacent-overload-signatures/
  // 相邻重载签名必须合并
  '@typescript-eslint/adjacent-overload-signatures': 'error',

  // https://typescript-eslint.io/rules/consistent-type-definitions/
  // 类型定义风格（interface/type），不强制
  '@typescript-eslint/consistent-type-definitions': 'off',

  // https://typescript-eslint.io/rules/explicit-member-accessibility/
  // 成员可访问性修饰符（public/private/protected），不强制
  '@typescript-eslint/explicit-member-accessibility': 'off',

  // https://typescript-eslint.io/rules/member-ordering/
  // 类成员顺序
  '@typescript-eslint/member-ordering': [
    'error',
    {
      default: [
        'public-static-field',
        'protected-static-field',
        'private-static-field',
        'static-field',
        'public-static-method',
        'protected-static-method',
        'private-static-method',
        'static-method',
        'public-instance-field',
        'protected-instance-field',
        'private-instance-field',
        'public-field',
        'protected-field',
        'private-field',
        'instance-field',
        'field',
        'constructor',
        'public-instance-method',
        'protected-instance-method',
        'private-instance-method',
        'public-method',
        'protected-method',
        'private-method',
        'instance-method',
        'method',
      ],
    },
  ],

  // https://typescript-eslint.io/rules/method-signature-style/
  // 方法签名风格，不强制
  '@typescript-eslint/method-signature-style': 'off',

  // https://typescript-eslint.io/rules/no-array-constructor/
  // 禁止使用 Array 构造函数
  '@typescript-eslint/no-array-constructor': 'error',

  // https://typescript-eslint.io/rules/no-dupe-class-members/
  // 禁止类成员重复
  '@typescript-eslint/no-dupe-class-members': 'error',

  // https://typescript-eslint.io/rules/no-empty-interface/
  // 禁止空接口
  '@typescript-eslint/no-empty-interface': 'error',

  // https://typescript-eslint.io/rules/no-inferrable-types/
  // 禁止多余的类型推断
  '@typescript-eslint/no-inferrable-types': 'warn',

  // https://typescript-eslint.io/rules/no-namespace/
  // 禁止使用 namespace，允许声明和定义文件
  '@typescript-eslint/no-namespace': [
    'error',
    { allowDeclarations: true, allowDefinitionFiles: true },
  ],

  // https://typescript-eslint.io/rules/no-non-null-asserted-optional-chain/
  // 禁止在可选链后使用非空断言
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',

  // https://typescript-eslint.io/rules/no-parameter-properties/
  // 禁止构造函数参数属性，不强制
  '@typescript-eslint/no-parameter-properties': 'off',

  // https://typescript-eslint.io/rules/no-require-imports/
  // 禁止 require 导入
  '@typescript-eslint/no-require-imports': 'error',

  // https://typescript-eslint.io/rules/no-this-alias/
  // 禁止 this 赋值给其他变量，允许解构
  '@typescript-eslint/no-this-alias': ['error', { allowDestructuring: true }],

  // https://typescript-eslint.io/rules/no-unused-expressions/
  // 禁止无用表达式，允许短路、三元、tagged template
  '@typescript-eslint/no-unused-expressions': [
    'error',
    {
      allowShortCircuit: true,
      allowTernary: true,
      allowTaggedTemplates: true,
    },
  ],

  // https://typescript-eslint.io/rules/no-unused-vars/
  // 禁止未使用变量，允许下划线开头
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      args: 'after-used',
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_.+',
      varsIgnorePattern: '^_.+',
    },
  ],

  // https://typescript-eslint.io/rules/no-useless-constructor/
  // 禁止无用构造函数
  '@typescript-eslint/no-useless-constructor': 'warn',

  // https://typescript-eslint.io/rules/prefer-for-of/
  // 优先使用 for-of
  '@typescript-eslint/prefer-for-of': 'warn',

  // https://typescript-eslint.io/rules/prefer-function-type/
  // 优先函数类型定义，不强制
  '@typescript-eslint/prefer-function-type': 'off',

  // https://typescript-eslint.io/rules/prefer-namespace-keyword/
  // 优先使用 namespace 关键字
  '@typescript-eslint/prefer-namespace-keyword': 'error',

  // https://typescript-eslint.io/rules/triple-slash-reference/
  // 三斜线指令规范
  '@typescript-eslint/triple-slash-reference': [
    'error',
    { path: 'never', types: 'always', lib: 'always' },
  ],

  // https://typescript-eslint.io/rules/typedef/
  // 类型定义要求
  '@typescript-eslint/typedef': [
    'error',
    {
      arrayDestructuring: false,
      arrowParameter: false,
      memberVariableDeclaration: false,
      objectDestructuring: false,
      parameter: false,
      propertyDeclaration: true,
      variableDeclaration: false,
    },
  ],

  // https://typescript-eslint.io/rules/unified-signatures/
  // 合并可统一的函数重载签名
  '@typescript-eslint/unified-signatures': 'error',
};

export default [
  {
    files: ['**/*.?([cm])ts', '**/*.?([cm])tsx'],
    languageOptions: {
      parser: parserTypeScript,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
      '@stylistic': stylistic,
    },
    rules: {
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
      ...pluginTypeScript.configs.recommended.rules,
      ...stylisticRules,
      ...tsRules,
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
