import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer,
} from 'axios';
import { stringify } from 'qs';

import requestInterceptor from './request';
import responseInterceptor from './response';

export interface IRequestConfig extends AxiosRequestConfig {
  globalError?: boolean;
}
interface IRequestResponseResult<T> {
  code: number;
  message: string;
  data: T;
}

interface HttpWithoutData {
  get: <T = unknown>(url: string, config?: IRequestConfig) => Promise<IRequestResponseResult<T>>;
  head: <T = unknown>(url: string, config?: IRequestConfig) => Promise<IRequestResponseResult<T>>;
  options: <T = unknown>(url: string, config?: IRequestConfig) => Promise<IRequestResponseResult<T>>;
  delete: <T = unknown>(url: string, config?: IRequestConfig) => Promise<IRequestResponseResult<T>>;
}
interface HttpWithData {
  post: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: IRequestConfig,
  ) => Promise<IRequestResponseResult<T>>;
  put: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: IRequestConfig,
  ) => Promise<IRequestResponseResult<T>>;
  patch: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: IRequestConfig,
  ) => Promise<IRequestResponseResult<T>>;
}

interface IHttp extends HttpWithoutData, HttpWithData {}

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

const requestData = <T, D = unknown>(cfg: AxiosRequestConfig<D>) => axiosInstance
  .request<IRequestResponseResult<T>, IRequestResponseResult<T>, D>(cfg);

// 构建 http 方法
const http: IHttp = {
  get: <T = unknown>(url: string, config: IRequestConfig = {}) => requestData<T>({ method: 'get', url, ...config }),
  head: <T = unknown>(url: string, config: IRequestConfig = {}) => requestData<T>({ method: 'head', url, ...config }),
  options: <T = unknown>(url: string, config: IRequestConfig = {}) => requestData<T>({ method: 'options', url, ...config }),
  delete: <T = unknown>(url: string, config: IRequestConfig = {}) => requestData<T>({ method: 'delete', url, ...config }),
  post: <T = unknown, D = unknown>(url: string, data?: D, config: IRequestConfig = {}) => requestData<T, D>({ method: 'post', url, data, ...config }),
  put: <T = unknown, D = unknown>(url: string, data?: D, config: IRequestConfig = {}) => requestData<T, D>({ method: 'put', url, data, ...config }),
  patch: <T = unknown, D = unknown>(url: string, data?: D, config: IRequestConfig = {}) => requestData<T, D>({ method: 'patch', url, data, ...config }),
};

export default http;
