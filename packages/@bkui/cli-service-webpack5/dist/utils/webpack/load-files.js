"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (config) {
    var assetsPath = config.assetsPath;
    return [
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: 'asset',
            generator: {
                filename: assetsPath('img/[name].[hash:7].[ext]'),
            },
            parser: {
                dataUrlCondition: {
                    maxSize: 8 * 1024, // 8kb, defaults
                },
            },
        },
        {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            type: 'asset',
            generator: {
                filename: assetsPath('media/[name].[hash:7].[ext]'),
            },
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            type: 'asset',
            generator: {
                filename: assetsPath('fonts/[name].[hash:7].[ext]'),
            },
        },
    ];
});
//# sourceMappingURL=load-files.js.map