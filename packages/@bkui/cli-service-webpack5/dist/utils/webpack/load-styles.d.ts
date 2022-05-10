import { ServiceConfig } from '../../typings/config';
declare const _default: (isProd: boolean, config: ServiceConfig) => {
    test: RegExp;
    oneOf: ({
        resourceQuery: RegExp;
        use: (string | {
            loader: any;
            options?: undefined;
        } | {
            loader: string;
            options: ({
                esModule: boolean;
                sourceMap: boolean;
                modules: {
                    localIdentName: string;
                };
            } | {
                esModule: boolean;
                sourceMap: boolean;
                modules?: undefined;
            }) & object;
        } | {
            loader: string;
            options: {};
        })[];
    } | {
        use: (string | {
            loader: any;
            options?: undefined;
        } | {
            loader: string;
            options: ({
                esModule: boolean;
                sourceMap: boolean;
                modules: {
                    localIdentName: string;
                };
            } | {
                esModule: boolean;
                sourceMap: boolean;
                modules?: undefined;
            }) & object;
        } | {
            loader: string;
            options: {};
        })[];
        resourceQuery?: undefined;
    })[];
}[];
export default _default;
