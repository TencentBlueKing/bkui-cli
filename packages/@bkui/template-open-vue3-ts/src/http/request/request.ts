import type {
  AxiosInterceptorManager,
  InternalAxiosRequestConfig,
} from 'axios';

import requestCanceler from './cancel'; // 引入请求取消器

export default (interceptors: AxiosInterceptorManager<InternalAxiosRequestConfig>) => {
  interceptors.use((request) => {
    // 使用返回的新配置
    return requestCanceler.addRequest(request) as InternalAxiosRequestConfig;
  }, undefined);
};
