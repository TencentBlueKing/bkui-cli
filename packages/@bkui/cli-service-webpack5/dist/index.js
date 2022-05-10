"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDev = exports.run = exports.createCompiler = void 0;
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
var commander_1 = (0, tslib_1.__importDefault)(require("commander"));
var excute_task_1 = (0, tslib_1.__importDefault)(require("./utils/excute-task"));
var dev_1 = (0, tslib_1.__importDefault)(require("./tasks/dev"));
var build_1 = (0, tslib_1.__importDefault)(require("./tasks/build"));
exports.createCompiler = (0, tslib_1.__importStar)(require("./utils/create-compiler"));
// eslint-disable-next-line import/prefer-default-export
var run = function () {
    commander_1.default
        .command('dev')
        .description('develop with dev mode')
        .action(function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, excute_task_1.default)(dev_1.default)({
                        production: false,
                        silent: false,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    commander_1.default
        .command('build')
        .option('-a, --analyze', 'enable analyze mode')
        .description('build production mode')
        .action(function (cmd) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, excute_task_1.default)(build_1.default)({
                        production: true,
                        analyze: !!cmd.analyze,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    commander_1.default.on('command:*', function () {
        console.error('Invalid command: %s\nSee --help for a list of available commands.', commander_1.default.args.join(' '));
        process.exit(1);
    });
    commander_1.default.parse(process.argv);
};
exports.run = run;
var runDev = function (options) { return (0, excute_task_1.default)(dev_1.default)(options); };
exports.runDev = runDev;
//# sourceMappingURL=index.js.map