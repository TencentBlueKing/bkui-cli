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
var load_config_1 = require("./webpack/load-config");
exports.default = (function (_a) {
    var _b = _a.production, production = _b === void 0 ? false : _b, _c = _a.analyze, analyze = _c === void 0 ? false : _c;
    return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var webpackConfig, compiler;
        return (0, tslib_1.__generator)(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, load_config_1.loadWebpackConfig)({ production: production, analyze: analyze })];
                case 1:
                    webpackConfig = _d.sent();
                    compiler = (0, webpack_1.default)(webpackConfig);
                    return [2 /*return*/, compiler];
            }
        });
    });
});
//# sourceMappingURL=create-compiler.js.map