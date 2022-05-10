export interface ServiceConfig {
    analyze: boolean;
    useCustomDevServer: boolean;
    env: any;
    dist: string;
    appDir: string;
    appIndex: string;
    appIndexHtml: string;
    assetsPath(path: string): string;
    css?: cssOptions;
}
export interface BundleOptions {
    production: boolean;
    analyze?: boolean;
    silent?: boolean;
}
export interface AppConfig {
    outputDir?: string;
    sourceDir?: string;
    mainPath?: string;
    indexPath?: string;
    assetsDir?: string;
    env?: object;
    useCustomDevServer?: boolean;
    eslintOnSave?: boolean;
    stylelintOnSave?: boolean;
    css?: cssOptions;
}
export interface cssOptions {
    loaderOptions?: loaderOptions;
}
export interface loaderOptions {
    css?: object;
    postcss?: object;
    sass?: object;
    scss?: object;
    less?: object;
    stylus?: object;
}
export interface Envs {
    [key: string]: any;
}
