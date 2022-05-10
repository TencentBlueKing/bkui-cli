"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveClientEnv = exports.applyEnv = void 0;
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
var fs_1 = (0, tslib_1.__importDefault)(require("fs"));
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
var dotenv_expand_1 = (0, tslib_1.__importDefault)(require("dotenv-expand"));
var bundle_config_1 = require("./bundle-config");
var applyEnv = function (mode) {
    if (mode === void 0) { mode = process.env.NODE_ENV; }
    if (fs_1.default.existsSync(path_1.default.resolve(bundle_config_1.appDirectory, '.bk.env'))) {
        (0, dotenv_expand_1.default)(dotenv_1.default.config({
            path: path_1.default.resolve(bundle_config_1.appDirectory, '.bk.env'),
        }));
    }
    if (fs_1.default.existsSync(path_1.default.resolve(bundle_config_1.appDirectory, ".bk.env.".concat(mode)))) {
        (0, dotenv_expand_1.default)(dotenv_1.default.config({
            path: path_1.default.resolve(bundle_config_1.appDirectory, ".bk.env.".concat(mode)),
        }));
    }
    if (fs_1.default.existsSync(path_1.default.resolve(bundle_config_1.appDirectory, '.bk.env.local'))) {
        (0, dotenv_expand_1.default)(dotenv_1.default.config({
            path: path_1.default.resolve(bundle_config_1.appDirectory, '.bk.env.local'),
        }));
    }
};
exports.applyEnv = applyEnv;
var resolveClientEnv = function () {
    var prefixRE = /^BK_/;
    var env = {};
    Object.keys(process.env).forEach(function (key) {
        if (prefixRE.test(key)) {
            env[key] = process.env[key];
        }
    });
    return {
        'process.env': Object.keys(env).reduce(function (result, key) {
            // eslint-disable-next-line no-param-reassign
            result[key] = JSON.stringify(env[key]);
            return result;
        }, {
            NODE_ENV: JSON.stringify(process.env.BK_NODE_ENV || process.env.NODE_ENV),
        }),
    };
};
exports.resolveClientEnv = resolveClientEnv;
//# sourceMappingURL=read-env.js.map