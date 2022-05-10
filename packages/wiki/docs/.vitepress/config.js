// vitepress/config.js
// import baseConfig from '@vue/theme/config'
// import type { Config as ThemeConfig } from '@vue/theme'

import nav from './nav'
import sidebar from './sidebar'

module.exports = {
    title: "蓝鲸前端开发脚手架",// 网站标题 顶部左侧标题
    description: '蓝鲸前端开发脚手架', //网站描述
    base: '/', //  部署时的路径 默认 /  可以使用二级地址 /base/
    // lang: 'en-US', //语言
    // 网页头部配置，引入需要图标，css，js
    head: [
        [
            "meta",
            {
                name: "keywords",
                content: "blueking/cli cli 蓝鲸脚手架"
            },
        ],
        [
            "meta",
            {
                name: "description",
                content: "蓝鲸前端开发脚手架 @blueking/cli，它是为了提升研发人员效能的脚手架工具，包含了创建项目、服务项目开发和构建、简化开发人员配置和全局服务等功能。"
            },
        ],
        // 改变title的图标
        [
            'link',
            {
                rel: 'icon',
                href: '/img/linktolink.png',//图片放在public文件夹下
            },
        ],
    ],
    // 主题配置
    themeConfig: {
        search: true,
        algolia: {
            apiKey: '',
            indexName: 'bk-cli'
        },
        // 保存解析 Markdown 的元数据
        // pages: await getPages(),
        repo: '', // 你的 github 仓库地址，网页的右上角会跳转
        // logo: '/images/logo.png', //左侧标题logo
        //   头部导航
        nav,
        //   侧边导航
        sidebar,
    },
    footer: {
        license: {
            text: 'MIT License',
            link: 'https://opensource.org/licenses/MIT'
        },
        copyright: `Copyright © 2014-${new Date().getFullYear()} FE`
    }
}
