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
var mini_css_extract_plugin_1 = (0, tslib_1.__importDefault)(require("mini-css-extract-plugin"));
exports.default = (function (isProd, config) {
    var _a = config.css.loaderOptions, loaderOptions = _a === void 0 ? {} : _a;
    var cssLoaders = function (isCssModule) {
        if (isCssModule === void 0) { isCssModule = false; }
        return [
            isProd ? { loader: mini_css_extract_plugin_1.default.loader } : 'vue-style-loader',
            {
                loader: 'css-loader',
                options: Object.assign(isCssModule ? {
                    esModule: false,
                    sourceMap: !isProd,
                    modules: {
                        localIdentName: '[name]_[local]_[hash:base64:5]'
                    }
                } : {
                    esModule: false,
                    sourceMap: !isProd
                }, loaderOptions.css),
            },
            {
                loader: 'postcss-loader',
                options: (0, tslib_1.__assign)({}, loaderOptions.postcss)
            },
        ];
    };
    return [
        {
            test: /\.css$/,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders(true)), false),
                },
                {
                    use: (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders()), false),
                }
            ],
        },
        {
            test: /\.p(ost)?css$/,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders(true)), false),
                },
                {
                    use: (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders()), false),
                }
            ],
        },
        {
            test: /\.s[ac]ss$/,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders(true)), false), [
                        {
                            loader: 'sass-loader',
                            options: (0, tslib_1.__assign)({}, (loaderOptions.scss || loaderOptions.sass)),
                        },
                    ], false),
                },
                {
                    use: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders()), false), [
                        {
                            loader: 'sass-loader',
                            options: (0, tslib_1.__assign)({}, (loaderOptions.scss || loaderOptions.sass)),
                        },
                    ], false),
                }
            ],
        },
        {
            test: /\.less$/,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders(true)), false), [
                        {
                            loader: 'less-loader',
                            options: (0, tslib_1.__assign)({}, loaderOptions.less),
                        },
                    ], false),
                },
                {
                    use: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders()), false), [
                        {
                            loader: 'less-loader',
                            options: (0, tslib_1.__assign)({}, loaderOptions.less),
                        },
                    ], false),
                }
            ],
        },
        {
            test: /\.styl(us)?$/,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders(true)), false), [
                        {
                            loader: 'stylus-loader',
                            options: (0, tslib_1.__assign)({}, loaderOptions.stylus),
                        },
                    ], false),
                },
                {
                    use: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(cssLoaders()), false), [
                        {
                            loader: 'stylus-loader',
                            options: (0, tslib_1.__assign)({}, loaderOptions.stylus),
                        },
                    ], false),
                }
            ],
        },
    ];
});
//# sourceMappingURL=load-styles.js.map