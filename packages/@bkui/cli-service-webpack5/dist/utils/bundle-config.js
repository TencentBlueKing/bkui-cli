"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveApp = exports.appDirectory = void 0;
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
/* eslint-disable no-nested-ternary */
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var fs_1 = (0, tslib_1.__importDefault)(require("fs"));
exports.appDirectory = fs_1.default.realpathSync(process.cwd());
var resolveApp = function (relativePath) { return path_1.default.resolve(exports.appDirectory, relativePath || '.'); };
exports.resolveApp = resolveApp;
function default_1(appConfig, _a) {
    var _b, _c, _d;
    var analyze = _a.analyze;
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var commonConfig;
        return (0, tslib_1.__generator)(this, function (_e) {
            commonConfig = {
                analyze: analyze,
                useCustomDevServer: appConfig.useCustomDevServer || false,
                env: (0, tslib_1.__assign)({}, appConfig.env),
                dist: (0, exports.resolveApp)(appConfig.outputDir || './dist'),
                appDir: (0, exports.resolveApp)(appConfig.sourceDir || './src/'),
                appIndex: (0, exports.resolveApp)(appConfig.mainPath || './src/main.js'),
                appIndexHtml: (0, exports.resolveApp)(appConfig.indexPath || './index.html'),
                assetsPath: function (subPath) {
                    return path_1.default.posix.join(appConfig.assetsDir || 'static', subPath);
                },
                eslintOnSave: (_b = appConfig.eslintOnSave) !== null && _b !== void 0 ? _b : false,
                stylelintOnSave: (_c = appConfig.stylelintOnSave) !== null && _c !== void 0 ? _c : false,
                css: (_d = appConfig.css) !== null && _d !== void 0 ? _d : {}
            };
            return [2 /*return*/, commonConfig];
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=bundle-config.js.map