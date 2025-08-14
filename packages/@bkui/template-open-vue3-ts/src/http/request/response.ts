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
      const { data } = response;
      const { code, message } = data;

      const requestKey = requestCanceler.getRequestKey(response.config);
      requestCanceler.removeRequest(requestKey);

      // 校验接口返回的数据，status 为 0 表示业务成功
      switch (data.code) {
        // 接口请求成功
        case 0:
          return Promise.resolve(data);
        // 后端业务处理报错
        default:
          throw new RequestError(code, message || '系统错误', data);
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
