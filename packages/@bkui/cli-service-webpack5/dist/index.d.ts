import { DevOption } from './tasks/dev';
export * as createCompiler from './utils/create-compiler';
export declare const run: () => void;
export declare const runDev: (options: DevOption) => Promise<void>;
