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
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

const stylisticRules = {
  '@stylistic/array-bracket-spacing': ['error', 'never'], // 数组括号内是否有空格
  '@stylistic/function-call-spacing': ['error', 'never'], // 函数调用括号前空格
  '@stylistic/arrow-parens': [
    'warn',
    'as-needed',
    { requireForBlockBody: true },
  ], // 箭头函数参数括号
  '@stylistic/arrow-spacing': 'warn', // 箭头函数箭头前后空格
  '@stylistic/block-spacing': 'error', // 代码块大括号内空格
  '@stylistic/brace-style': 'error', // 大括号风格
  '@stylistic/comma-dangle': ['warn', 'always-multiline'], // 末尾逗号
  '@stylistic/comma-spacing': ['error', { before: false, after: true }], // 逗号前后空格
  '@stylistic/comma-style': ['error', 'last'], // 逗号位置
  '@stylistic/computed-property-spacing': ['warn', 'never'], // 计算属性括号内空格
  '@stylistic/eol-last': ['error', 'always'], // 文件末尾换行
  '@stylistic/function-paren-newline': ['warn', 'multiline'], // 函数参数括号换行
  '@stylistic/generator-star-spacing': ['warn', { before: false, after: true }], // generator 星号空格
  '@stylistic/implicit-arrow-linebreak': ['warn', 'beside'], // 箭头函数箭头换行
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
  ], // 缩进风格
  '@stylistic/key-spacing': 'error', // 对象键值冒号空格
  '@stylistic/keyword-spacing': [
    'error',
    {
      overrides: {
        if: { after: true },
        for: { after: true },
        while: { after: true },
        else: { after: true },
      },
    },
  ], // 关键字前后空格
  '@stylistic/linebreak-style': ['warn', 'unix'], // 换行符风格
  '@stylistic/max-len': [
    'error',
    {
      code: 120,
      ignoreStrings: true,
      ignoreUrls: true,
      ignoreRegExpLiterals: true,
      ignoreTemplateLiterals: true,
    },
  ], // 最大行长度
  '@stylistic/newline-per-chained-call': ['warn', { ignoreChainWithDepth: 2 }], // 链式调用换行
  '@stylistic/no-mixed-operators': [
    'error',
    {
      groups: [
        ['%', '**'],
        ['%', '+'],
        ['%', '-'],
        ['%', '*'],
        ['%', '/'],
        ['&', '|', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!=='],
        ['&&', '||'],
      ],
      allowSamePrecedence: false,
    },
  ], // 禁止混用不同优先级操作符
  '@stylistic/no-multiple-empty-lines': 'error', // 禁止多行空行
  '@stylistic/no-trailing-spaces': 'error', // 禁止行尾空格
  '@stylistic/object-curly-spacing': ['warn', 'always'], // 对象大括号内空格
  '@stylistic/operator-linebreak': [
    'error',
    'before',
    { overrides: { '=': 'none' } },
  ], // 操作符换行
  '@stylistic/padded-blocks': ['error', 'never'], // 代码块内空行
  '@stylistic/quote-props': ['error', 'as-needed', { keywords: false }], // 属性名加引号
  '@stylistic/quotes': ['warn', 'single', { allowTemplateLiterals: false }], // 字符串引号
  '@stylistic/semi': ['error', 'always'], // 语句分号
  '@stylistic/space-before-blocks': 'error', // 代码块前空格
  '@stylistic/space-before-function-paren': [
    'error',
    { anonymous: 'always', named: 'never', asyncArrow: 'always' },
  ], // 函数括号前空格
  '@stylistic/space-in-parens': ['error', 'never'], // 括号内空格
  '@stylistic/space-infix-ops': 'error', // 操作符两边空格
  '@stylistic/spaced-comment': ['error', 'always'], // 注释前空格
  '@stylistic/template-curly-spacing': ['error', 'never'], // 模板字符串花括号内空格
  '@stylistic/wrap-iife': ['error', 'outside'], // IIFE 括号风格
};

const baseRules = {
  ...js.configs.recommended.rules, // https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js
  'array-callback-return': 'warn', // 数组回调必须有返回值
  camelcase: ['error', { ignoreDestructuring: true, properties: 'never' }], // 驼峰命名
  'dot-notation': 'warn', // 点号访问对象属性
  eqeqeq: ['warn', 'always'], // 强制全等
  'func-style': ['off', 'expression'], // 函数风格
  'new-cap': [
    'error',
    {
      newIsCap: true,
      newIsCapExceptions: [],
      capIsNew: false,
      capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
      properties: false,
    },
  ], // 构造函数大写
  'no-array-constructor': ['error'], // 禁止 Array 构造函数
  'no-else-return': ['warn', { allowElseIf: false }], // return 后禁止 else
  'no-eval': 'error', // 禁止 eval
  'no-iterator': 'warn', // 禁止 __iterator__
  'no-loop-func': 'error', // 禁止循环内定义函数
  'no-multi-assign': 'error', // 禁止链式赋值
  'no-nested-ternary': 'warn', // 禁止嵌套三元
  'no-new-func': 'error', // 禁止 Function 构造函数
  'no-new-object': 'error', // 禁止 Object 构造函数
  'no-new-wrappers': 'warn', // 禁止包装类
  'no-param-reassign': [
    'warn',
    {
      props: true,
      ignorePropertyModificationsFor: [
        'acc',
        'accumulator',
        'e',
        'ctx',
        'req',
        'request',
        'res',
        'response',
        '$scope',
        'staticContext',
        'state',
      ],
    },
  ], // 禁止参数重新赋值
  'no-plusplus': ['error', { allowForLoopAfterthoughts: true }], // 禁止 ++/--
  'no-restricted-properties': [
    'warn',
    { object: 'Math', property: 'pow', message: 'Please use ** instand' },
  ], // 限制属性
  'no-restricted-syntax': [
    'warn',
    {
      selector: 'ForInStatement',
      message:
        'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
    },
    {
      selector: 'LabeledStatement',
      message:
        'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
    },
    {
      selector: 'WithStatement',
      message:
        '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
    },
  ], // 限制语法
  'no-underscore-dangle': 'warn', // 禁止下划线变量
  'no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_.*', // 忽略以下划线开头的参数
      varsIgnorePattern: '^_.*', // 忽略以下划线开头的变量
    },
  ], // 禁止未使用变量
  'no-unneeded-ternary': 'warn', // 禁止不必要三元
  'no-useless-constructor': 'warn', // 禁止无用构造函数
  'no-var': 'error', // 禁止 var
  'object-shorthand': 'warn', // 对象简写
  'one-var': ['warn', 'never'], // 单行声明多个变量
  'prefer-arrow-callback': 'warn', // 优先箭头回调
  'prefer-const': [
    'error',
    { destructuring: 'any', ignoreReadBeforeAssign: false },
  ], // 优先 const
  'prefer-destructuring': [
    'warn',
    {
      VariableDeclarator: { array: false, object: true },
      AssignmentExpression: { array: true, object: false },
    },
    { enforceForRenamedProperties: false },
  ], // 优先解构
  'prefer-rest-params': 'warn', // 优先剩余参数
  'prefer-spread': 'warn', // 优先扩展运算符
  'prefer-template': 'error', // 优先模板字符串
  radix: 'warn', // parseInt 必须指定基数
};

export default [
  {
    ignores: ['**/node_modules/**'], // 排除 node_modules 下所有文件
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...baseRules,
      ...stylisticRules,
      ...importPlugin.configs.recommended.rules,
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'simple-import-sort/imports': ['error', {
        groups: [
          ['^[a-zA-Z]'],
          ['^@'],
          ['^@lib'],
          ['^@service'],
          ['^@model'],
          ['^@hooks'],
          ['^@components'],
          ['^@views'],
          ['^@\\w'],
          ['^@router'],
          ['^@utils'],
          ['^@css'],
          ['^@language'],
          ['^\\.\\.'],
          ['^\\.'],
        ],
      }],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json'],
        },
        typescript: createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: './tsconfig.json', // 指定 tsconfig 路径
        }),
      },
    },
  },
];
