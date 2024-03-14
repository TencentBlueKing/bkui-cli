import Config from 'webpack-chain';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type {
  EntryObject,
} from 'webpack';

type ValueOf<T> = T[keyof T];

export type EntryConfig =  ValueOf<EntryObject>;

export type Mode = 'none' | 'development' | 'production';

export interface IReplaceStaticUrlPluginOption {
  exclude?: null | RegExp[];
  key: string;
}

export interface IContext {
  mode: Mode;
  workDir: string;
  options: IOptions;
}

export interface IResource {
  entry: string | string[];
  html: HtmlWebpackPlugin.Options;
}

export interface ICss {
  cssLoaderOptions: any;
  stylusLoaderOptions: any;
  lessLoaderOptions: any;
  scssLoaderOptions: any;
  sassLoaderOptions: any;
}

export interface ICopy {
  from: string,
  to: string,
  globOptions?: any
}

export interface IOptions {
  assetsDir: string
  outputDir: string
  outputAssetsDirName: string
  filenameHashing: boolean
  publicPath: string
  cache: boolean
  resource: { [pageName: string]: IResource }
  copy: ICopy[] | ICopy
  css?: ICss
  host: string
  port: number
  https: boolean | { [key: string]: any }
  open: boolean
  runtimeCompiler: boolean
  typescript: boolean
  tsconfig: string
  forkTsChecker: boolean
  bundleAnalysis: boolean | any
  parseNodeModules: boolean
  parallel: boolean | number
  customEnv: string
  replaceStatic: boolean | IReplaceStaticUrlPluginOption
  target: 'web' | 'lib'
  libraryTarget: string
  libraryName: string
  splitChunk: boolean
  splitCss: boolean
  clean: boolean
  lazyCompilation: boolean
  lazyCompilationHost: string
  envPrefix: string
  configureWebpack: object
  chainWebpack: (config: Config) => Config
}
