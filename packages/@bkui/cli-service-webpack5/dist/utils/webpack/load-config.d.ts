import * as webpack from 'webpack';
import { BundleOptions } from '../../typings/config';
declare type WebpackConfigurationGetter = (options: BundleOptions) => Promise<webpack.Configuration>;
export declare type CustomWebpackConfigurationGetter = (originalConfig: webpack.Configuration, options: any) => webpack.Configuration;
export declare const loadWebpackConfig: WebpackConfigurationGetter;
export {};
