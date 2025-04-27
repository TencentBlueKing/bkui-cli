/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
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
const js = require('@eslint/js');
const globals = require('globals');
const importPlugin = require('eslint-plugin-import');

// base
module.exports = [
  {
    ignores: [
      'dist',
      'public',
      'postcss.config.js',
      'bk.config.js',
      'paas-server',
      'mock-server',
      'node_modules',
    ],
  },
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        document: 'readonly',
        window: 'readonly',
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      ...js.configs.recommended.rules, // https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js
      'array-callback-return': 'warn', // 在数组方法的回调中强制执行 return 语句
      camelcase: ['error', { ignoreDestructuring: true, properties: 'never' }], // 强制实施驼峰命名约定
      'dot-notation': 'warn', // 尽可能强制使用点表示法
      eqeqeq: ['warn', 'always'], // 需要使用 === 和 ！==
      'func-style': ['off', 'expression'], // 强制一致地使用分配给变量的函数声明或表达式
      'new-cap': [
        'error',
        {
          newIsCap: true,
          newIsCapExceptions: [],
          capIsNew: false,
          capIsNewExceptions: [
            'Immutable.Map',
            'Immutable.Set',
            'Immutable.List',
          ],
          properties: false,
        },
      ], // 要求构造函数名称以大写字母开头
      'no-array-constructor': ['error'], // 禁止数组构造函数
      'no-else-return': ['warn', { allowElseIf: false }], // 不允许在 if 语句中的 return 语句后使用 else 块
      'no-eval': 'error', // 不允许使用 eval（）
      'no-iterator': 'warn', // 禁止使用 __iterator__ 属性
      'no-loop-func': 'error', // 禁止在循环语句中包含不安全引用的函数声明
      'no-multi-assign': 'error', // 禁止使用链式赋值表达式
      'no-nested-ternary': 'warn', // 不允许嵌套的三元表达式
      'no-new-func': 'error', // 禁止使用 Function 对象使用新运算符
      'no-new-object': 'error', // 不允许 Object 构造函数 // 替换  no-object-constructor。
      'no-new-wrappers': 'warn', // 不允许使用 String、Number 和 Boolean 对象使用新运算符
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
      ], // 不允许重新分配函数参数
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }], // 不允许使用一元运算符 ++ 和 --
      'no-restricted-properties': [
        'warn',
        { object: 'Math', property: 'pow', message: 'Please use ** instand' },
      ], // 禁止对某些对象使用某些属性
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
      ], // 禁止指定语法
      'no-underscore-dangle': 'warn', // 不允许标识符中出现悬空下划线
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_.*', // 忽略以下划线开头的参数
          varsIgnorePattern: '^_.*', // 忽略以下划线开头的变量
        },
      ], // 禁止未使用的变量
      'no-unneeded-ternary': 'warn', // 当存在更简单的替代项时，不允许使用三元运算符
      'no-useless-constructor': 'warn', // 不允许不必要的构造函数
      'no-var': 'error', // 需要 let 或 const 而不是 var
      'object-shorthand': 'warn', //  需要或禁止对象文本的方法和属性速记语法
      'one-var': ['warn', 'never'], // 强制在函数中一起或单独声明变量
      'prefer-arrow-callback': 'warn', // 要求使用箭头函数进行回调
      'prefer-const': [
        'error',
        { destructuring: 'any', ignoreReadBeforeAssign: false },
      ], // 要求对在声明后从不重新分配的变量进行 const 声明
      'prefer-destructuring': [
        'warn',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: true, object: false },
        },
        { enforceForRenamedProperties: false },
      ], // 需要从数组和/或对象中解构
      'prefer-rest-params': 'warn', // 需要 rest 参数而不是参数
      'prefer-spread': 'warn', // 需要扩展运算符而不是 .apply（）
      'prefer-template': 'error', // 需要模板文本而不是字符串连接
      quotes: ['warn', 'single', { allowTemplateLiterals: false }], // 强制一致使用反引号、双引号或单引号
      radix: 'warn', // 在使用 parseInt（） 时强制一致地使用 radix 参数
      semi: ['error', 'always'], // 需要或不允许使用分号代替 ASI
    },
  },
];
