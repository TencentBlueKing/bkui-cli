module.exports = {
    title: "蓝鲸前端开发脚手架",
    description: '蓝鲸前端开发脚手架',
    base: '/',
    themeConfig: {
        logo: '/images/svg/logo.svg',
        nav: [
            { text: '首页', link: '/' },
            { text: '指引', link: '/markdown/guide', },
            { text: '构建工具', link: '/markdown/cli-service', },
            { text: '配置', link: '/markdown/config', },
            {
                text: 'GitHub',
                link: 'https://github.com/TencentBlueKing/bkui-cli',
                target: '_blank'
            }
        ],
        search: {
            provider: 'local'
        },
    },
    head: [
        ['link', { rel: 'icon', href: '/images/favicon.ico' }],
    ], 
    footer: {
        license: {
            text: 'MIT License',
            link: 'https://opensource.org/licenses/MIT'
        },
        copyright: `Copyright © 2014-${new Date().getFullYear()} FE`
    }
}
