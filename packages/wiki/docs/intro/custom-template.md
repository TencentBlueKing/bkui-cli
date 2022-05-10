## 自定义模板

> 除了系统提供的模板外，开发者还可以开发自定义模板，来满足更多场景的需求

### 可以按照以下步骤开发自定义模板：
- 新建文件夹
- 执行 `npm init` 命令来初始化 npm 包
- 在当前文件夹下新建`template`文件夹，用于存放模板内容
- 开发模板内容
- 开发完以后将包推送到 [NPM](https://www.npmjs.com/)等npm源上，安装的时候指定到对应的源即可

### 开发模板内容
#### 通常我们需要通过一套模板来生成不同的项目，目前提供了两种方式来实现：
- 基于问答，然后使用 [EJS](https://ejs.co/) 来动态渲染模板内容。注意：这里的分隔符（delimiter）为 $
- 通过函数直接修改生成的项目内容，主入口函数会传入一个包含了修改方法的对象，目前支持使用`addPrompt`、`modifyPackage`和`modifyProject`方法，具体用法如下

npm 包的主入口文件内容示例如下：

``` bash
module.exports = (extendHelp) => {
  extendHelp.addPrompt([
    {
      name: 'features',
      message: 'Select the features that will be used in the project.',
      type: 'checkbox',
      choices: ['Vuex', 'Axios', 'Postcss', 'Eslint', 'Stylelint'],
    },
    {
      name: 'webpack',
      message: 'Select the webpack version',
      type: 'list',
      choices: ['webpack4', 'webpack5'],
    },
  ]);

  extendHelp.modifyPackage((packageJson, answers) => {
    if (answers.webpack === 'webpack4') {
      packageJson.devDependencies['webpack'] = '^4.0.0';
    }
    if (answers.webpack === 'webpack5') {
      packageJson.devDependencies['webpack'] = '5.0.0';
    }
  });

  extendHelp.modifyProject((tree, answers) => {
    if (answers.features.includes('Postcss')) {
      // it will add postcss.config.js file
      tree['postcss.config.js'] = 'postcss 文件内容'
    }
  });
};
```

### 使用自定义模板：
- 确保已安装 `@blueking/cli`
- 执行 `bkui add <templatePakcage> -t`