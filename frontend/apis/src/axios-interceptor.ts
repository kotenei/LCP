import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface InterceptorOps {
  request?: InternalAxiosRequestConfig;
  response?: AxiosResponse;
}

export interface ResponseData<T> {
  message?: string;
  data: T;
}

const aixosInterceptors = (options?: InterceptorOps) => {
  const { request = {}, response = {} } = options || {};

  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const requestConfig: InternalAxiosRequestConfig = {
        ...config,
        ...request,
      };
      return requestConfig;
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    },
  );

  axios.interceptors.response.use(
    (res: AxiosResponse) => {
      return { ...res, ...response };
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    },
  );
};

export default aixosInterceptors;
