"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWebpackConfig = void 0;
var tslib_1 = require("tslib");
var fs_1 = (0, tslib_1.__importDefault)(require("fs"));
var util_1 = (0, tslib_1.__importDefault)(require("util"));
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var webpack_merge_1 = require("webpack-merge");
var create_config_1 = (0, tslib_1.__importDefault)(require("./create-config"));
var bundle_config_1 = (0, tslib_1.__importDefault)(require("../bundle-config"));
var accessPromise = util_1.default.promisify(fs_1.default.access);
var isFn = function (exp) {
    return Object.prototype.toString.call(exp) === '[object Function]';
};
var loadWebpackConfig = function (option) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var customWebpackPath, customConfig, _a, configureWebpack, _b, appConfig, bundleConfig, baseConfig, resultConfig, err_1;
    return (0, tslib_1.__generator)(this, function (_c) {
        switch (_c.label) {
            case 0:
                customWebpackPath = path_1.default.resolve(process.cwd(), 'bk.config.js');
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                return [4 /*yield*/, accessPromise(customWebpackPath)];
            case 2:
                _c.sent();
                return [4 /*yield*/, require(customWebpackPath)];
            case 3:
                customConfig = _c.sent();
                _a = customConfig.configureWebpack, configureWebpack = _a === void 0 ? {} : _a, _b = customConfig.appConfig, appConfig = _b === void 0 ? {} : _b;
                return [4 /*yield*/, (0, bundle_config_1.default)(isFn(appConfig) ? appConfig(option) : appConfig, option)];
            case 4:
                bundleConfig = _c.sent();
                baseConfig = (0, create_config_1.default)(bundleConfig);
                if (isFn(configureWebpack)) {
                    resultConfig = configureWebpack(baseConfig, option);
                    // 有返回值则执行合并，否则视为直接修改配置
                    if (resultConfig) {
                        return [2 /*return*/, (0, webpack_merge_1.merge)(baseConfig, resultConfig)];
                    }
                    return [2 /*return*/, baseConfig];
                }
                return [2 /*return*/, (0, webpack_merge_1.merge)(baseConfig, configureWebpack)];
            case 5:
                err_1 = _c.sent();
                throw err_1;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.loadWebpackConfig = loadWebpackConfig;
//# sourceMappingURL=load-config.js.map