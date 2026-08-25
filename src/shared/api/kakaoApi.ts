import { createApiClient } from './client';
import { KAKAO_API_BASE_URL, KAKAO_MOBILITY_BASE_URL, KAKAO_API_KEY } from '../constants/api';

/**
 * 카카오 로컬 API 클라이언트 (장소 검색)
 */
export const kakaoLocalApi = createApiClient(KAKAO_API_BASE_URL);

kakaoLocalApi.interceptors.request.use((config) => {
  config.headers.Authorization = `KakaoAK ${KAKAO_API_KEY}`;
  return config;
});

/**
 * 카카오 모빌리티 API 클라이언트 (경로 탐색)
 */
export const kakaoMobilityApi = createApiClient(KAKAO_MOBILITY_BASE_URL);

kakaoMobilityApi.interceptors.request.use((config) => {
  config.headers.Authorization = `KakaoAK ${KAKAO_API_KEY}`;
  return config;
});

/**
 * 카카오 로컬 API 요청
 */
export async function fetchKakaoLocal<T>(
  endpoint: string,
  params?: Record<string, string | number>,
): Promise<T> {
  const response = await kakaoLocalApi.get<T>(endpoint, { params });
  return response.data;
}

/**
 * 카카오 모빌리티 API 요청
 */
export async function fetchKakaoMobility<T>(
  endpoint: string,
  params?: Record<string, string | number>,
): Promise<T> {
  const response = await kakaoMobilityApi.get<T>(endpoint, { params });
  return response.data;
}
