import { ServiceConfig, BundleOptions, AppConfig } from '../typings/config';
export declare const appDirectory: string;
export declare const resolveApp: (relativePath: string) => string;
export default function (appConfig: AppConfig, { analyze }: BundleOptions): Promise<ServiceConfig>;
