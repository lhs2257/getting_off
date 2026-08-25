/**
 * 두 좌표 간 거리를 미터 단위로 계산합니다 (Haversine 공식).
 */
export function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // 지구 반지름 (m)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 정거장 도착 판정 반경 (m) */
export const STOP_ARRIVAL_RADIUS = 150;

/** 정거장 접근 알림 반경 (m) */
export const STOP_APPROACHING_RADIUS = 500;

/**
 * 좌표 목록에서 현재 위치에 가장 가까운 항목의 인덱스와 거리를 반환합니다.
 */
export function findNearestIndex(
  lat: number,
  lon: number,
  points: { x: number; y: number }[],
): { index: number; distance: number } | null {
  if (points.length === 0) return null;

  let minDist = Infinity;
  let minIndex = 0;

  for (let i = 0; i < points.length; i++) {
    const dist = getDistanceMeters(lat, lon, points[i].y, points[i].x);
    if (dist < minDist) {
      minDist = dist;
      minIndex = i;
    }
  }

  return { index: minIndex, distance: minDist };
}
