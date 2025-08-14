import type { IRequestConfig } from './index';

export class RequestCanceler {
  private abortControllerMap: Map<string, AbortController>;

  constructor() {
    this.abortControllerMap = new Map();
  }

  // 添加请求
  addRequest(config: IRequestConfig) {
    const requestKey = this.getRequestKey(config);
    this.removeRequest(requestKey);

    const controller = new AbortController();

    const newConfig = {
      ...config,
      signal: controller.signal,
    };

    this.abortControllerMap.set(requestKey, controller);
    return newConfig;
  }

  // 移除请求
  removeRequest(requestKey: string) {
    if (this.abortControllerMap.has(requestKey)) {
      const controller = this.abortControllerMap.get(requestKey);
      if (controller && !controller.signal.aborted) {
        controller.abort();
      }
      this.abortControllerMap.delete(requestKey);
    }
  }

  // 取消所有请求
  cancelAllRequest() {
    this.abortControllerMap.forEach((controller) => {
      controller.abort();
    });
    this.abortControllerMap.clear();
  }

  // 重置
  reset() {
    this.abortControllerMap.clear();
  }

  // 生成唯一请求标识
  getRequestKey(config: IRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(config.data)}`;
  }
}

export default new RequestCanceler();
