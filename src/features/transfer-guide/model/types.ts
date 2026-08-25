/**
 * 환승 정보
 */
export interface TransferInfo {
  /** 현재 구간 인덱스 */
  fromSubPathIndex: number;
  /** 하차 정거장명 */
  exitStopName: string;
  /** 다음 구간 유형 (1: 지하철, 2: 버스, 3: 도보) */
  nextTrafficType: number;
  /** 다음 노선명 */
  nextLaneName: string;
  /** 다음 탑승 정거장명 */
  nextBoardingStop: string;
  /** 환승 도보 거리 (m) */
  walkingDistance: number;
  /** 환승 도보 시간 (초) */
  walkingSeconds: number;
  /** 환승 도보 시간 (포맷팅) */
  walkingTimeFormatted: string;
}
