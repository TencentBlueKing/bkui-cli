import {
  AxiosError,
  type AxiosInterceptorManager,
  type AxiosResponse,
} from 'axios';
import { Message } from 'bkui-vue';

import { loginModal } from '@/common/auth';

import requestCanceler from './cancel';
import type { IRequestConfig } from './index';
import RequestError from './request-error';

export default (interceptors: AxiosInterceptorManager<AxiosResponse>) => {
  interceptors.use(
    (response: AxiosResponse) => {
      const { data, config } = response;
      const { responseType } = config;

      const requestKey = requestCanceler.getRequestKey(config);
      requestCanceler.removeRequest(requestKey);

      // 根据不同的响应类型进行处理
      switch (responseType) {
        case 'arraybuffer':
        case 'blob':
          // 二进制数据响应：直接返回，不进行业务状态码检查
          // 通常用于文件下载等场景
          return Promise.resolve(data);

        case 'text':
          // 文本响应：直接返回，不进行业务状态码检查
          // 通常用于纯文本内容
          return Promise.resolve(data);

        case 'stream':
          // 流响应：直接返回，不进行业务状态码检查
          // 通常用于大文件或实时数据流
          // 注意：stream 类型主要在 Node.js 环境中使用
          return Promise.resolve(data);

        case 'document':
          // XML 文档响应：直接返回，不进行业务状态码检查
          // 通常用于 XML 数据
          return Promise.resolve(data);

        default: {
          // 默认处理：尝试按 JSON 处理，如果不是 JSON 则直接返回
          const { code, message } = data;

          switch (code) {
            case 0:
              return Promise.resolve(data);
            default:
              throw new RequestError(code, message || '系统错误', data);
          }
        }
      }
    },
    (error: AxiosError) => {
      const { response, message, code } = error;
      const config = error.config as IRequestConfig;

      if (config) {
        const requestKey = requestCanceler.getRequestKey(response.config);
        requestCanceler.removeRequest(requestKey);
      }

      // 服务器响应数据
      if (response) {
        const { status } = response;

        // 处理特定错误码
        switch (status) {
          // 用户登录状态失效
          case 401:
            loginModal();
            break;
        }

        return Promise.reject(new RequestError(status || -1, message, response));
      }

      // 全局捕获错误给出提示
      if (config?.globalError) {
        Message({ theme: 'error', message });
      }

      return Promise.reject(new RequestError(Number(code) || -1, message, response));
    },
  );
};
