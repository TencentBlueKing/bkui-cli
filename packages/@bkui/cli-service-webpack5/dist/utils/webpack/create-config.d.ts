import { ServiceConfig } from '../../typings/config';
import { Configuration } from 'webpack-dev-server';
import webpack from 'webpack';
declare const _default: (config: ServiceConfig) => webpack.Configuration & {
    devServer?: Configuration;
};
export default _default;
