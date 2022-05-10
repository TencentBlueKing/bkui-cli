## Vue 基础模板

> 模板内容包含 Vue + Vuex + Vue Router + Axios + Postcss + Eslint + Stylelint 等功能。使用`init`命令生成项目的时候，如果使用该模板，可以选择使用哪些功能，也可以选择使用哪个版本的CLI服务。开发中具体的配置可以查看相应的CLI服务文档

### 功能特性

- 模板业务内容为空，生成项目后无需删改，直接进行开发 ✨
- 模板可选有哪些功能（Vuex + Vue Router + Axios + Postcss + Eslint + Stylelint），支持生成从最简单到最完整的项目 🚀
- 默认集成了 Babel、Eslint、 Stylelint 的配置（如果开启对应功能），无需额外配置工作 📦

### 本地开发

```bash
# 安装依赖
npm i

# 启动开发服务器
npm run dev
```

#### 发布部署

```bash
# 前端构建
npm run build
```

#### 使用全部功能的项目，其项目目录结构如下：
```bash
|-- ROOT/               # 项目根目录
    |-- src/            # 🌟实际项目的源码目录
    |   |-- App.vue     # App 组件
    |   |-- main.js     # 主入口
    |   |-- api/        # 对 axios 封装的目录
    |   |   |-- index.js          # axios 封装
    |   |-- components/     # 项目中组件的存放目录
    |   |   |-- HelloWorld.vue       # HelloWorld 组件
    |   |-- router/         # 项目 router 存放目录
    |   |   |-- index.js    # index router
    |   |-- store/          # 项目 store 存放目录
    |   |   |-- index.js    # store
    |   |-- views/          # 项目页面组件存放目录
    |       |-- Home.vue     # Home 页面组件
    |-- static/             # 静态资源存放目录
    |   |-- favicon.png   # 图标文件
    |-- .babelrc        # babel 配置
    |-- .bk.env      # 项目的环境变量配置
    |-- .bk.config.js      # 🌟CLI 服务配置文件
    |-- .browserslistrc      # 编译代码兼容浏览器配置
    |-- .eslintignore   # eslintignore 配置
    |-- .eslintrc.js    # eslint 配置
    |-- .stylelintrc.js # stylelintrc 配置文件
    |-- .stylelintignore # stylelintignore 配置文件
    |-- index.html      # html 文件
    |-- package.json    # package.json
    |-- postcss.config.js # postcss 配置文件，我们提供了一些常用的 postcss 插件，详细内容请参见文件
    |-- README.md       # 工程的 README
```