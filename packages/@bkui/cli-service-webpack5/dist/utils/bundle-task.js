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
var webpack_dev_server_1 = (0, tslib_1.__importDefault)(require("webpack-dev-server"));
var chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
var load_config_1 = require("./webpack/load-config");
exports.default = (function (_a) {
    var production = _a.production, _b = _a.analyze, analyze = _b === void 0 ? false : _b, _c = _a.silent, silent = _c === void 0 ? false : _c;
    return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var webpackConfig, webpackPromise;
        return (0, tslib_1.__generator)(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, load_config_1.loadWebpackConfig)({ production: production, analyze: analyze })];
                case 1:
                    webpackConfig = _d.sent();
                    webpackPromise = new Promise(function (resolve, reject) {
                        if (!production) {
                            webpack_dev_server_1.default.addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);
                            var compiler = (0, webpack_1.default)(webpackConfig);
                            if (!silent) {
                                compiler.hooks.invalid.tap('invalid', function () {
                                    console.log('Compiling...');
                                });
                            }
                            var devServer = new webpack_dev_server_1.default(compiler, webpackConfig.devServer);
                            devServer.listen(webpackConfig.devServer.port || 7000, webpackConfig.devServer.host || '127.0.0.1', function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                                if (!silent) {
                                    console.log(chalk_1.default.cyan('Starting the development server...\n'));
                                }
                            });
                            if (silent) {
                                compiler.hooks.done.tapAsync('done', function (stats, callback) {
                                    if (!stats.hasErrors()) {
                                        console.clear();
                                        console.log(chalk_1.default.cyan("\n  App running at http://".concat(webpackConfig.devServer.host, ":").concat(webpackConfig.devServer.port, "\n")));
                                    }
                                    callback();
                                });
                            }
                            resolve();
                        }
                        else {
                            var compiler = (0, webpack_1.default)(webpackConfig);
                            compiler.run(function (err, stats) {
                                if (err) {
                                    reject(err.message);
                                    return;
                                }
                                if (stats.hasErrors()) {
                                    stats.compilation.errors.forEach(function (e) {
                                        console.log(e.message);
                                    });
                                    reject('Build failed');
                                }
                                console.log('\n', stats.toString({ colors: true }), '\n');
                                resolve();
                            });
                        }
                    });
                    return [2 /*return*/, webpackPromise];
            }
        });
    });
});
//# sourceMappingURL=bundle-task.js.map