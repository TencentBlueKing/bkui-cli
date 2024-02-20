# 前端开发工具配置

## Babel 配置

#### 安装方法：
```bash
$ npm i @blueking/babel-preset-bk --save-dev
```

#### 使用方法：
修改项目根目录的 `.babelrc` 的配置如下：
```json
{
  "presets": [
    "@blueking/babel-preset-bk"
  ]
}
```

## Eslint 配置

#### 安装方法：
```bash
$ npm i @blueking/eslint-config-bk --save-dev
```

#### 使用方法：
修改项目根目录的 `.eslintrc.js` 的配置如下：
```js
module.exports = {
  root: true,
  extends: ['@blueking/eslint-config-bk/vue'],
};
```

#### 基于不同场景可以选择不同的规则，目前js和ts是公司规则，vue使用的是蓝鲸规则。规则列表如下：
- js: @blueking/eslint-config-bk
- ts: @blueking/eslint-config-bk/ts
- ts + vue: @blueking/eslint-config-bk/tsvue
- js + vue: @blueking/eslint-config-bk/vue

## Stylelint 配置

#### 安装方法：
```bash
$ npm i @blueking/stylelint-config-bk --save-dev
```

#### 使用方法：
修改项目根目录的 `.stylelintrc.js` 的配置如下：
```js
module.exports = {
  defaultSeverity: 'error',
  extends: ['@blueking/stylelint-config-bk']
}
```
