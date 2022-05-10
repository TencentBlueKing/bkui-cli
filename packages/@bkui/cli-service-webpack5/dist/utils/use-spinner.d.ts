declare type spinFn<T> = (options: T) => Promise<void>;
declare const _default: <T = any>(label: string, cb: spinFn<T>, killProcess?: boolean) => (options: T) => Promise<void>;
export default _default;
