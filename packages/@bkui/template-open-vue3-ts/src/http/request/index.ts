import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer,
} from 'axios';
import { stringify } from 'qs';

import requestInterceptor from './request';
import responseInterceptor from './response';

export type IRequestResponseData<T> = T;
type HttpWithoutData = {
  [K in (typeof methodsWithoutData)[number]]: <T = unknown>(
    url: string,
    config?: IRequestConfig,
  ) => Promise<
    IRequestResponseResult<
      T extends IRequestResponseData<unknown> ? T : IRequestResponseData<T>
    >
  >;
};
type HttpWithData = {
  [K in (typeof methodsWithData)[number]]: <T = unknown>(
    url: string,
    data: Record<string, unknown>,
    config?: IRequestConfig,
  ) => Promise<
    IRequestResponseResult<
      T extends IRequestResponseData<unknown> ? T : IRequestResponseData<T>
    >
  >;
};

export interface IRequestConfig extends AxiosRequestConfig {
  globalError?: boolean;
}
interface IRequestResponseResult<T> {
  result: boolean;
  code: number;
  message: string;
  request_id: string;
  data: T;
}
interface IHttp extends HttpWithoutData, HttpWithData {}

const methodsWithoutData = ['get', 'head', 'options', 'delete'] as const;
const methodsWithData = ['post', 'put', 'patch'] as const;
const allMethods = [...methodsWithoutData, ...methodsWithData];

const defaultConfig: IRequestConfig = {
  timeout: 10000,
  headers: {},
  withCredentials: true,
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
};

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create(defaultConfig);

// 添加响应拦截器
responseInterceptor(axiosInstance.interceptors.response);
requestInterceptor(axiosInstance.interceptors.request);

// 在自定义对象 http 上添加各请求方法

const http = {} as IHttp;
allMethods.forEach((method) => {
  Object.defineProperty(http, method, {
    get() {
      if (
        methodsWithData.includes(method as (typeof methodsWithData)[number])
      ) {
        // 带数据方法（POST/PUT/PATCH）
        return async (
          url: string,
          data: Record<string, unknown>,
          config: IRequestConfig = {},
        ) => axiosInstance({
          method,
          url,
          data,
          ...config,
        });
      }
      // 无数据方法（GET/DELETE等）
      return async (url: string, config: IRequestConfig = {}) => axiosInstance({
        method,
        url,
        ...config,
      });
    },
  });
});

export default http;
