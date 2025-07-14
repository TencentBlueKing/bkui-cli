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

/**
 * Vue共用ESLint规则
 * 这个文件包含Vue2和Vue3共用的ESLint规则
 */
const stylisticRules = {
  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/array-bracket-spacing.md
  // 数组括号内是否有空格
  'vue/array-bracket-spacing': ['error', 'never'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/arrow-spacing.md
  // 箭头函数箭头前后空格
  'vue/arrow-spacing': ['error', { before: true, after: true }],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/block-spacing.md
  // 代码块大括号内空格
  'vue/block-spacing': ['error', 'always'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/brace-style.md
  // 大括号风格
  'vue/brace-style': ['error', '1tbs', { allowSingleLine: false }],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-closing-bracket-spacing.md
  // 标签闭合括号前的空格
  'vue/html-closing-bracket-spacing': [
    'error',
    { startTag: 'never', endTag: 'never', selfClosingTag: 'always' },
  ],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-end-tags.md
  // 强制要求结束标签
  'vue/html-end-tags': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-indent.md
  // html 缩进风格
  'vue/html-indent': [
    'error',
    2,
    {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: [],
    },
  ],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-quotes.md
  // html 属性值必须使用双引号
  'vue/html-quotes': ['error', 'double'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/key-spacing.md
  // 对象键值冒号空格
  'vue/key-spacing': [
    'error',
    { beforeColon: false, afterColon: true },
  ],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/keyword-spacing.md
  // 关键字前后空格
  'vue/keyword-spacing': ['error', { before: true, after: true }],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-multi-spaces.md
  // 删除 html 标签中连续多个不用于缩进的空格
  'vue/no-multi-spaces': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-spaces-around-equal-signs-in-attribute.md
  // 属性等号两边不能有空格
  'vue/no-spaces-around-equal-signs-in-attribute': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/object-curly-spacing.md
  // 对象写在一行时，大括号里需要空格
  'vue/object-curly-spacing': ['error', 'always'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/space-infix-ops.md
  // 操作符两边空格
  'vue/space-infix-ops': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/space-unary-ops.md
  // 一元操作符前后空格
  'vue/space-unary-ops': ['error', { words: true, nonwords: false }],
};

export default {
  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/multi-word-component-names.md
  'vue/multi-word-component-names': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/array-bracket-spacing.md
  'vue/array-bracket-spacing': ['error', 'never'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/arrow-spacing.md
  'vue/arrow-spacing': ['error', { before: true, after: true }],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/attribute-hyphenation.md
  'vue/attribute-hyphenation': ['error', 'always'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/attributes-order.md
  // 属性顺序，不限制
  'vue/attributes-order': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/block-spacing.md
  'vue/block-spacing': ['error', 'always'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/brace-style.md
  'vue/brace-style': ['error', '1tbs', { allowSingleLine: false }],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/camelcase.md
  // 后端数据字段经常不是驼峰，所以不限制 properties，也不限制解构
  'vue/camelcase': [
    'error',
    { properties: 'never', ignoreDestructuring: true },
  ],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/comment-directive.md
  // vue 文件 template 中允许 eslint-disable eslint-enable eslint-disable-line eslint-disable-next-line
  // 行内注释启用/禁用某些规则，配置为 1 即允许
  'vue/comment-directive': 1,

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/component-name-in-template-casing.md
  // 组件 html 标签的形式，连字符形式，所有 html 标签均会检测，如引入第三方不可避免，可通过 ignores 配置，支持正则，不限制
  'vue/component-name-in-template-casing': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/dot-location.md
  'vue/dot-location': ['error', 'property'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/eqeqeq.md
  'vue/eqeqeq': ['error', 'always', { null: 'ignore' }],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-closing-bracket-newline.md
  // 单行写法不需要换行，多行需要，不限制
  'vue/html-closing-bracket-newline': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-closing-bracket-spacing.md
  'vue/html-closing-bracket-spacing': [
    'error',
    {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always',
    },
  ],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-end-tags.md
  'vue/html-end-tags': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-indent.md
  'vue/html-indent': [
    'error',
    2,
    {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: [],
    },
  ],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-quotes.md
  'vue/html-quotes': ['error', 'double'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-self-closing.md
  // html tag 是否自闭和，不限制
  'vue/html-self-closing': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/jsx-uses-vars.md
  // 当变量在 `JSX` 中被使用了，那么 eslint 就不会报出 `no-unused-vars` 的错误。需要开启 eslint no-unused-vars 规则才适用
  'vue/jsx-uses-vars': 1,

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/key-spacing.md
  'vue/key-spacing': ['error', { beforeColon: false, afterColon: true }],

  // 关键字周围空格一致性，在关键字前后保留空格，如 if () else {}
  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/keyword-spacing.md
  'vue/keyword-spacing': ['error', { before: true, after: true }],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/match-component-file-name.md
  // 组件名称属性与其文件名匹配，不限制
  'vue/match-component-file-name': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/max-attributes-per-line.md
  // 每行属性的最大个数，不限制
  'vue/max-attributes-per-line': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/multiline-html-element-content-newline.md
  // 在多行元素的内容前后需要换行符，不限制
  'vue/multiline-html-element-content-newline': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/mustache-interpolation-spacing.md
  // template 中 {{var}}，不限制
  'vue/mustache-interpolation-spacing': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/name-property-casing.md
  'vue/name-property-casing': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-boolean-default.md
  'vue/no-boolean-default': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-empty-pattern.md
  // 禁止解构中出现空 {} 或 []
  'vue/no-empty-pattern': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-multi-spaces.md
  // 删除 html 标签中连续多个不用于缩进的空格
  'vue/no-multi-spaces': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-restricted-syntax.md
  // 禁止使用特定的语法
  'vue/no-restricted-syntax': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-side-effects-in-computed-properties.md
  // 禁止在计算属性对属性进行修改，不限制
  'vue/no-side-effects-in-computed-properties': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-spaces-around-equal-signs-in-attribute.md
  'vue/no-spaces-around-equal-signs-in-attribute': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-template-key.md
  // 禁止在 <template> 中使用 key 属性，不限制
  'vue/no-template-key': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-template-shadow.md
  'vue/no-template-shadow': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-v-html.md
  // 禁止使用 v-html，防止 xss
  'vue/no-v-html': 'error',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/object-curly-spacing.md
  // 对象写在一行时，大括号里需要空格
  'vue/object-curly-spacing': ['error', 'always'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/prop-name-casing.md
  // 组件 props 属性名驼峰命名
  'vue/prop-name-casing': ['error', 'camelCase'],

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/require-default-prop.md
  // props 必须要有默认值，不限制
  'vue/require-default-prop': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/require-direct-export.md
  // 组件必须要直接被 export。不限制
  'vue/require-direct-export': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/require-valid-default-prop.md
  // props 默认值必须有效。不限制
  'vue/require-valid-default-prop': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/singleline-html-element-content-newline.md
  // 单行 html 元素后面必须换行。不限制
  'vue/singleline-html-element-content-newline': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/use-v-on-exact.md
  // 强制使用精确修饰词。不限制
  'vue/use-v-on-exact': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/v-bind-style.md
  // v-bind 指令的写法。不限制
  'vue/v-bind-style': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/v-on-function-call.md
  // 强制或禁止在 v-on 指令中不带参数的方法调用后使用括号。不限制
  'vue/v-on-function-call': 'off',

  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/v-on-style.md
  // v-on 指令的写法。限制简写
  'vue/v-on-style': ['error', 'shorthand'],

  // 格式化相关
  ...stylisticRules,
};
