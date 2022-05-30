export default {
    "/":[
        {
            text:"简介",
            link:'/intro/index'
        },
        {
            text:"新手入门",
            children:[
                {
                    text:'安装与使用',
                    link:'/intro/install-and-usage'
                },
            ]
        },
        {
            text:"命令",
            children:[
                {
                    text:'命令使用',
                    link:'/intro/command-info'
                },
                {
                    text:'自定义命令',
                    link:'/intro/custom-command'
                }
            ]
        },
        {
            text:"Vue 模板",
            children:[
                {
                    text:'Vue 基础模板',
                    link:'/intro/empty-vue'
                },
                {
                    text:'开发自定义模板',
                    link:'/intro/custom-template'
                },
            ]
        },
        {
            text:"CLI 服务",
            children:[
                {
                    text:'Webpack4',
                    link:'/intro/cli-server'
                },
                {
                    text:'webpack5',
                    link:'/intro/cli-webpack5'
                },
            ]
        },
        {
            text:"CLI 参数说明",
            children:[
                {
                    text:'cli-webpack5 参数详细说明',
                    link:'/intro/cli-webpack5-props'
                },
            ]
        },
        {
            text:"CLI 配置包",
            children:[
                {
                    text:'配置包使用方法',
                    link:'/intro/cli-config'
                },
            ]
        },
        {
            text:"CLI 全局服务",
            children:[
                {
                    text:'全局服务',
                    link:'/intro/global-server'
                },
            ]
        }
    ]
}
