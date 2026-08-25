/**
 * API 기본 URL 및 설정 상수
 */

export const SEOUL_API_BASE_URL = 'http://openapi.seoul.go.kr:8088';
export const ODSAY_API_BASE_URL = 'https://api.odsay.com/v1/api';

/** API 응답 타임아웃 (ms) */
export const API_TIMEOUT = 10_000;

/** API 키 (Expo 환경변수) */
export const SEOUL_API_KEY = process.env.EXPO_PUBLIC_SEOUL_API_KEY ?? '';
export const ODSAY_API_KEY = process.env.EXPO_PUBLIC_ODSAY_API_KEY ?? '';
