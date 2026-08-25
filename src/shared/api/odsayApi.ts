import { createApiClient } from './client';
import { ODSAY_API_BASE_URL, ODSAY_API_KEY } from '../constants/api';

/**
 * ODsay API 클라이언트
 *
 * 모든 요청에 apiKey 쿼리 파라미터를 자동 추가합니다.
 *
 * @see https://lab.odsay.com
 */
export const odsayApi = createApiClient(ODSAY_API_BASE_URL);

odsayApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    apiKey: ODSAY_API_KEY,
  };
  return config;
});

/**
 * ODsay API 공통 요청
 *
 * @param endpoint - 엔드포인트 (예: /searchPubTransPathT)
 * @param params - 쿼리 파라미터
 */
export async function fetchOdsayApi<T>(
  endpoint: string,
  params?: Record<string, string | number>,
): Promise<T> {
  const response = await odsayApi.get<T>(endpoint, { params });
  return response.data;
}
