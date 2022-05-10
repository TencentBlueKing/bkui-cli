

## 蓝鲸前端开发脚手架 2.0

### 简介
---
欢迎使用蓝鲸前端开发脚手架 `@blueking/cli`，它是为了提升研发人员效能的脚手架工具，包含了创建项目、服务项目开发和构建、简化开发人员配置和全局服务等功能。它提供了`webpack4`和`webpack5`的服务，降低了开发者使用`webpack`门槛，让开发者可以更专注业务开发。它提供了`Babel`、`Eslint`和`Stylelint`的配置包，简化开发者的配置工作，去除重复的配置工作，提升研发效能。它提供了全局服务，来辅助开发者进行开发，目前提供了单页调试和静态资源代理两个功能。并且支持自定义命令和自定义模板，来满足更多定制化的场景

### 特性
---
> @blueking/cli工具以提升研发效能为目标进行开发，分别从以下几个方面提升研发效能：
- 交互式生成项目，更好的指引，帮助开发者从零开始开发项目
- 提供了丰富的模板系统，提供了三套系统模板，也支持开发自定义模板
- 提供了自定义命令系统，方便开发者自定义命令
- 提供了 `webpack4` 和 `webpack5` 插件，内置`webapck`相关配置，帮助开发者更方便的使用`webpack`
- 提供了 `Babel` 的配置包，方便用户快速配置 `Babel`
- 提供了 `Eslint` 的配置包，方便用户快速配置 `Eslint`
- 提供了 `Stylelint` 的配置包，方便用户快速配置 `Stylelint`

### 概念
---
#### 命令
在全局安装完`@blueking/cli`以后，便可以在控制台使用命令做一些操作了。CLI提供了交互式的命令（`init`, `add`, `preset`, `remove`, `serve`）。其中`init`用于生成项目；`add`和`remove`用于操作自定义模板和自定义命令；`preset`可以操作预设文件，预设文件主要是结合特定的场景来快速生成项目；`serve`用于单页调试

#### 模板
通过`@blueking/cli`的`init`命令，可以通过模板来生成项目。模板会设置一些问答，同一套模板不同答案生成的项目会不同。目前系统提供了 Vue 基础模板，具体模板内容可以查阅模板文档。

#### 预设
模板介绍里面说到，同一套模板不同答案生成的项目会不同。每次使用模板生成项目，都需要回答问题，比较繁琐。预设是一系列答案的组合，通过使用预设，可以跳过问答环节，来使用预先设定好的答案来生成项目，这样会更加方便。开发者可以直接使用系统提供的预设，或者在生成项目后保存该次问答为预设，也可以通过`preset`命令直接操作预设。

#### CLI 服务
CLI 服务构建于`webpack`之上，内置许多常用的插件，提供`dev`和`build`两个命令。开发者通过 CLI 服务可以零配置使用`webpack`的能力，也支持定制化来使用`webpack`。目前提供了 `webpack4`和`webpack5`2个版本的 CLI 服务

#### CLI 配置包
日常开发中，大部分项目都会用到 `Babel`、`Eslint`和`Stylelint`，每个项目的配置大多都很类似。为了简化开发者工作，提升研发效率，我们提供了相应的配置包，让开发者更便捷的使用这些工具

#### CLI 全局服务
除了创建项目和配置项目，我们在开发中还会用到一些工具来辅助开发，比如调试等。于是我们做出了 CLI 全局服务这个工具，主要是为了服务项目的整个生命周期，目前支持了单文件调试和静态资源代理两个功能，后续会增加更多能力，敬请期待