import { ServiceConfig } from '../../typings/config';
declare const _default: (config: ServiceConfig) => ({
    test: RegExp;
    exclude: RegExp[];
    use: ({
        loader: string;
        options: {
            cacheDirectory: boolean;
        };
    } | {
        loader: string;
        options: {
            transpileOnly: boolean;
            appendTsSuffixTo: RegExp[];
            compilerOptions: {
                module: string;
            };
        };
    })[];
    include?: undefined;
} | {
    test: RegExp;
    exclude: RegExp[];
    use: ({
        loader: string;
        options?: undefined;
    } | {
        loader: string;
        options: {
            cacheDirectory: boolean;
        };
    })[];
    include: string[];
})[];
export default _default;
