/** 기본 보행 속도 (m/s) - 성인 평균 약 1.2m/s (4.3km/h) */
const DEFAULT_WALKING_SPEED = 1.2;

/**
 * 거리 기반 도보 소요 시간 계산 (초)
 *
 * @param distanceMeters - 거리 (m)
 * @param speedMs - 보행 속도 (m/s, 기본값: 1.2)
 */
export function calcWalkingSeconds(
  distanceMeters: number,
  speedMs = DEFAULT_WALKING_SPEED,
): number {
  return Math.ceil(distanceMeters / speedMs);
}

/**
 * 도보 시간을 사람이 읽기 쉬운 형태로 변환
 */
export function formatWalkingTime(seconds: number): string {
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 1) return '1분 미만';
  return `약 ${minutes}분`;
}
