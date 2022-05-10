## 自定义命令

> 除了系统提供的命令外，开发者可以自己开发命令，来满足更多场景的需求

### 可以按照以下步骤开发自定义命令：
- 新建文件夹
- 执行 `npm init` 命令来初始化 npm 包
- npm 包的主入口需要抛出函数，入参是`program`对象，具体使用方法见 [commander文档](https://github.com/tj/commander.js)
- 开发具体业务逻辑
- 开发完以后将包推送到 [NPM](https://www.npmjs.com/)等npm源上，安装的时候指定到对应的源即可

npm 包的主入口文件内容示例如下：

``` bash
module.exports = (program) => {
  program
    .command('do <params>')
    .description('Single file debugging and local directory proxy commands')
    .option('--param <paramName>', 'Custon command param')
    .action((params, cmd) => {
      // exec action with options
    });
};
```

### 使用自定义命令：
- 确保已安装 `@blueking/cli`
- 执行 `bkui add <commandPakcage> -c`
