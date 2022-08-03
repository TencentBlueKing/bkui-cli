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
import { Configuration } from 'webpack-dev-server';
export interface HtmlWebPackPluginPage{
  entry: string,
  // the source template
  template: string,
  // output as dist/index.html
  filename: string,
  // when using title option,
  // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
  title?: string,
  // chunks to include on this page, by default includes
  // extracted common chunks and vendor chunks.
  chunks?: string[]
}
export interface OutPages {
  [props: string]: HtmlWebPackPluginPage
}
export interface OutputEntry {
  [props: string]: string
}
export type TargetType = 'web'|'lib'|'wc'|'window'|'var'|'umd';
export interface ServiceConfig {
  analyze: boolean;
  useCustomDevServer: boolean;
  env: any;
  dist: string;
  appDir: string;
  publicPath: string;
  css: CssOptions;
  entry: OutputEntry,
  pages?: object[],
  needSplitChunks: boolean,
  needHashName: boolean,
  minChunkSize: number,
  classificatoryStatic: boolean,
  target: TargetType,
  library: string,
  devServer: Configuration,
  dropConsole: boolean
  assetsPath(path: string): string,
}
export interface BundleOptions {
  production: boolean;
  analyze?: boolean;
  silent?: boolean;
}

export interface AppConfig {
  outputDir?: string;
  sourceDir?: string;
  publicPath?: string;
  mainPath?: string;
  indexPath?: string;
  assetsDir?: string;
  env?: object;
  useCustomDevServer?: boolean;
  eslintOnSave?: boolean;
  stylelintOnSave?: boolean;
  css?: CssOptions;
  needSplitChunks?: boolean,
  needHashName?: boolean,
  pages?: OutPages,
  entry: OutputEntry,
  devServer: Configuration,
  minChunkSize?: number,
  classificatoryStatic?: boolean,
  target?: TargetType,
  library?: string,
  dropConsole: boolean
}

export interface CssOptions {
  loaderOptions?: LoaderOptions;
}

export interface LoaderOptions {
  css?: object;
  postcss?: object;
  sass?: object;
  scss?: object;
  less?: object;
  stylus?: object;
}

export interface Envs {
  [key: string]: any
}
