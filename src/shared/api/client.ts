import axios from 'axios';
import { API_TIMEOUT } from '../constants/api';

/**
 * 공통 Axios 인스턴스 팩토리
 * 각 API별로 baseURL만 다르게 생성합니다.
 */
export function createApiClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (__DEV__) {
        console.warn(
          `[API Error] ${error.config?.baseURL}${error.config?.url}`,
          error.message,
        );
      }
      return Promise.reject(error);
    },
  );

  return client;
}
