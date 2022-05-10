# bk-webpack5-service

## 使用

```
// 生产环境
webpack5-cli-service build

// 开发环境
webpack5-cli-service dev
```

## 自定义配置

项目根目录创建 **bk.config.js**
### 修改 webpack 配置
```js
module.exports = {
  configureWebpack: {
    devServer: {
      host: 'dev.myapp.com',
      port: 7788
    }
  }
}

// 或者使用函数形式，在函数内，你可以直接修改配置，或者返回一个将会被合并的对象

module.exports = {
  configureWebpack (config, option) {
    // console.log(config) 已经解析好的完整 webpack 配置
    return {
      devServer: {
        host: 'dev.myapp.com',
        port: 7788
      }
    }
  }
}
```

### 应用配置

```js
module.exports = {
  appConfig: {
    outputDir: 'dist', // 构建产物目录
    assetsDir: 'static', // 放置生成的静态资源 (js、css、img、fonts) 的目录
    sourceDir: './src', // 源码目录
    mainPath: './src/main.js', // 应用入口
    indexPath: './public/index.html', // 入口html

    // 环境（全局）变量，可同时作用于模板html和脚本中
    env: {
      BASE_URL: JSON.stringify('/')
    }
  }
}

// 同样支持函数形式

module.exports = {
  appConfig (option) {
    // option.production ? true : false
    return {
      sourceDir: './src',
      mainPath: './src/main.js',
      indexPath: './public/index.html',
      env: {
        BASE_URL: option.production ? JSON.stringify('/') : JSON.stringify('/dev')
      }
    }
  }
}
```
