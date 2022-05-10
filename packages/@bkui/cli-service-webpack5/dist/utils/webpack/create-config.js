"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/
var load_styles_1 = (0, tslib_1.__importDefault)(require("./load-styles"));
var load_files_1 = (0, tslib_1.__importDefault)(require("./load-files"));
var load_script_1 = (0, tslib_1.__importDefault)(require("./load-script"));
var load_optimize_1 = (0, tslib_1.__importDefault)(require("./load-optimize"));
var load_plugin_1 = (0, tslib_1.__importDefault)(require("./load-plugin"));
var load_devserver_1 = (0, tslib_1.__importDefault)(require("./load-devserver"));
exports.default = (function (config) {
    var isProd = process.env.NODE_ENV === 'production';
    var assetsPath = config.assetsPath;
    var baseConfig = {
        mode: isProd ? 'production' : 'development',
        entry: { main: config.appIndex },
        output: {
            path: config.dist,
            filename: assetsPath(isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js'),
            chunkFilename: assetsPath(isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js'),
            publicPath: '/',
            clean: true, // 5.20.0+
        },
        resolve: {
            extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
            alias: {
                '@': config.appDir,
            },
            modules: [
                'node_modules',
            ],
            fallback: {
                fs: false,
                path: require.resolve('path-browserify'),
            },
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        hotReload: !isProd,
                    },
                },
                {
                    oneOf: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)((0, load_script_1.default)(config)), false), (0, tslib_1.__read)((0, load_styles_1.default)(isProd, config)), false), (0, tslib_1.__read)((0, load_files_1.default)(config)), false),
                },
            ],
        },
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename]
            }
        },
        optimization: (0, tslib_1.__assign)({}, (0, load_optimize_1.default)(isProd)),
        plugins: (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)((0, load_plugin_1.default)(isProd, config)), false).filter(Boolean),
        watchOptions: {
            ignored: /node_modules/,
        },
        node: {
            global: false,
            __filename: false,
            __dirname: false,
        },
        performance: false,
        devtool: isProd ? false : 'eval-source-map',
        stats: {
            children: false,
            warningsFilter: /export .* was not found in/,
            source: false,
        },
    };
    if (!config.useCustomDevServer) {
        baseConfig.devServer = (0, tslib_1.__assign)({}, (0, load_devserver_1.default)());
    }
    return baseConfig;
});
//# sourceMappingURL=create-config.js.map