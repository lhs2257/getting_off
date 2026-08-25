import { createApiClient } from './client';
import { SEOUL_API_BASE_URL, SEOUL_API_KEY } from '../constants/api';

/**
 * 서울열린데이터광장 API 클라이언트
 *
 * 엔드포인트 형식: /{apiKey}/{responseType}/{서비스명}/{startIndex}/{endIndex}
 * 예: /sample/json/realtimeStationArrival/0/5
 *
 * @see https://data.seoul.go.kr
 */
export const seoulApi = createApiClient(SEOUL_API_BASE_URL);

type SeoulApiResponseType = 'json' | 'xml';

/**
 * 서울 열린데이터 API 공통 요청
 *
 * @param service - 서비스명 (예: realtimeStationArrival)
 * @param startIndex - 시작 인덱스
 * @param endIndex - 끝 인덱스
 * @param responseType - 응답 형식 (기본: json)
 */
export async function fetchSeoulApi<T>(
  service: string,
  startIndex: number,
  endIndex: number,
  responseType: SeoulApiResponseType = 'json',
): Promise<T> {
  const url = `/${SEOUL_API_KEY}/${responseType}/${service}/${startIndex}/${endIndex}`;
  const response = await seoulApi.get<T>(url);
  return response.data;
}
