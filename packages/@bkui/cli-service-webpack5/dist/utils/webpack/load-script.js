"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (config) { return [
    {
        test: /\.tsx?$/,
        exclude: [/\/node_modules\//],
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true, // node_modules/.cache/babel-loader
                },
            },
            {
                loader: 'ts-loader',
                options: Object.assign({}, {
                    transpileOnly: true,
                    appendTsSuffixTo: [/\.vue$/],
                    compilerOptions: {
                        module: 'es2015',
                    },
                }),
            },
        ],
    },
    {
        test: /\.js$/,
        exclude: [/\/node_modules\//],
        use: [
            {
                loader: 'thread-loader',
            },
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                },
            },
        ].filter(Boolean),
        include: [config.appDir],
    },
]; });
//# sourceMappingURL=load-script.js.map