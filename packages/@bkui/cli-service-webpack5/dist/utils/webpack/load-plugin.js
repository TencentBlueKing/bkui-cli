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
var webpack_1 = (0, tslib_1.__importDefault)(require("webpack"));
var plugin_1 = (0, tslib_1.__importDefault)(require("vue-loader/lib/plugin"));
var mini_css_extract_plugin_1 = (0, tslib_1.__importDefault)(require("mini-css-extract-plugin"));
var progress_bar_webpack_plugin_1 = (0, tslib_1.__importDefault)(require("progress-bar-webpack-plugin"));
var html_webpack_plugin_1 = (0, tslib_1.__importDefault)(require("html-webpack-plugin"));
var eslint_webpack_plugin_1 = (0, tslib_1.__importDefault)(require("eslint-webpack-plugin"));
var stylelint_webpack_plugin_1 = (0, tslib_1.__importDefault)(require("stylelint-webpack-plugin"));
// import stylelintFormatter from 'stylelint-formatter-pretty';
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
var chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
var read_env_1 = require("../read-env");
exports.default = (function (isProd, config) { return [
    config.eslintOnSave ? new eslint_webpack_plugin_1.default({
        extensions: ['js', 'vue'],
        files: [config.appDir],
        failOnWarning: true,
        formatter: require('eslint-friendly-formatter'),
    }) : undefined,
    config.stylelintOnSave ? new stylelint_webpack_plugin_1.default({
        files: ['**/*.vue', '**/*.s?(a|c)ss'],
        failOnWarning: true,
        // formatter: stylelintFormatter,
    }) : undefined,
    new html_webpack_plugin_1.default(Object.assign({
        filename: 'index.html',
        template: config.appIndexHtml,
        templateParameters: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (0, read_env_1.resolveClientEnv)()), config.env),
    }, isProd ? {
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        },
    } : {})),
    new progress_bar_webpack_plugin_1.default({
        format: "  build [:bar] ".concat(chalk_1.default.green.bold(':percent'), " (:elapsed seconds)\n"),
    }),
    new webpack_1.default.DefinePlugin((0, tslib_1.__assign)((0, tslib_1.__assign)({}, (0, read_env_1.resolveClientEnv)()), config.env)),
    new plugin_1.default(),
    isProd ? new mini_css_extract_plugin_1.default({
        filename: config.assetsPath('css/[name][contenthash:7].css'),
        ignoreOrder: true,
    }) : undefined,
    new webpack_1.default.optimize.MinChunkSizePlugin({
        minChunkSize: 10000,
    }),
    new webpack_1.default.NoEmitOnErrorsPlugin(),
    config.analyze ? new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 7002,
    }) : undefined,
].filter(Boolean); });
//# sourceMappingURL=load-plugin.js.map