## bkui init 命令

> 命令行输入 `bkui init <projectName>` 会执行生成项目的逻辑

参数如下：
- `-p, --preset` 指定使用某个预设来快速生成项目，非必填
- `-f, --folder` 指定将项目生成到某个文件夹下，参数绝对地址和相对地址都可以，非必填

完整使用如下：
```bash
$ bkui init <projectName> -p <preset> -f <folder>
```

## bkui preset 命令

> preset是CLI的预设文件，用于快速生成项目。生成项目后可以保存预设或者执行`preset`命令直接操作预设文件

参数如下：
- `-i, --init` 初始化预设文件，可以使用系统或者第三方提供的预设包来批量修改预设文件
- `-l, --list` 显示本机的预设列表
- `-d, --Delete` 删除指定预设

具体使用如下：
```bash
$ bkui preset -i <presetPackage>
$ bkui preset -l
$ bkui preset -d <preset>
```

## bkui add 命令

> 开发完自定义命令和自定义模板以后，使用`add`命令安装到本机

参数如下：
- `-t, --bkTemplate` 安装自定义模板使用
- `-c, --bkCommand` 安装自定义命令使用
- `-r, --registry` 指定安装时的registry

具体使用如下：
```bash
$ bkui add <templatePackage> -t
$ bkui add <commandPackage> -c
$ bkui add <package> -r 'https://registry.npmjs.org/'
```

## bkui remove 命令

> 使用`remove`命令删除本机的自定义模板和自定义命令

参数如下：
- `-t, --bkTemplate` 删除自定义模板使用
- `-c, --bkCommand` 删除自定义命令使用

具体使用如下：
```bash
$ bkui remove <templatePackage> -t
$ bkui remove <commandPackage> -c
```

## bkui serve 命令

> `serve` 命令主要是为了服务项目的整个生命周期，目前支持了单文件调试和静态资源代理两个功能，具体请查看[CLI全局服务文档](#/global-server)

具体使用如下：
```bash
$ bkui serve file.vue
$ bkui serve main.js
$ bkui serve .
```