# 搭建前端项目

## 使用 CLI 命令快速生成项目
```bash
# 企业版
npm create bkui my-project --template open-vue3-ts

# 业务组件 & lesscode自定义组件
npm create bkui my-project --template lesscode-component
```

## 本地开发与生产构建
### 本地开发
1. 新建 `${ROOT}/.bk.local.env`文件
2. 填写 BK_LOGIN_URL = '填写登录地址'
3. 填写 BK_APP_HOST = '127.0.0.0'，注意登录后 cookie 写入的域名
4. 根目录执行 `npm run dev`
5. 配置 host，打开 BK_APP_HOST 配置了域名的地址

### 生产构建
根目录执行`npm run build`

## 前端项目工程介绍

### bin 目录
bin 目录下有 2 个钩子文件，可以在项目在开发者中心构建前后执行

### mock-server 目录
前端框架提供了 mock 服务，可以在 mock-server 编写 mock 服务。

### paas-server 目录
该目录使用 express 启动 web 服务。在开发者中心部署后，会使用 paas-server 启动 web 服务。该服务会处理统一登录的逻辑，详见 paas-server -> middleware -> user.js 文件

### src 目录
该目录编写 vue 相关代码，包含了 vue、vue-router、vue-store、pinia、api 等能力，详细编写语法可以参阅官方文档

### static 目录
如果项目中有些资源不参与打包构建，可以放到这个文件下。在项目中使用该文件的时候，使用 `/文件名` 这样的形式。

### types 目录
ts 项目会有这个目录，这里存放全局相关的 ts 文件

### .babelrc 文件
这里编写 babel 相关配置，一般可以不改动

### .bk.local.env
这里编写 dev 模式下的变量，dev 模式下优先级最高。

### .bk.development.env
这里编写 dev 模式下的变量，优先级仅次于 .bk.local.env 

### .bk.env
这里编写变量，在所有模式下生效，优先级最低

### .bk.production.env
这里编写 production 模式下的变量，优先级高于 .bk.env

### .bk.stag.env
这里编写 production 模式下的变量，且只在开发者中心的预发布环境有效，优先级高于 .bk.env 和 .bk.production.env


## 配置说明
配置文件统一在 .env 文件中进行编写。
1. 变量名需要是`BK_`开头，可以使用 `BK_XXX = $XXX` 的形式使用环境变量中的值
2. 定义好的变量，就可以在前端工程中使用 `process.env.BK_XXX` 来使用
