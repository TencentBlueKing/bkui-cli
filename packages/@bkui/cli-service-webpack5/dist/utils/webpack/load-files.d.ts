import { ServiceConfig } from '../../typings/config';
declare const _default: (config: ServiceConfig) => ({
    test: RegExp;
    type: string;
    generator: {
        filename: string;
    };
    parser: {
        dataUrlCondition: {
            maxSize: number;
        };
    };
} | {
    test: RegExp;
    type: string;
    generator: {
        filename: string;
    };
    parser?: undefined;
})[];
export default _default;
