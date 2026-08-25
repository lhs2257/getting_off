import type { OdsaySubPath } from '../../../entities/route/model/types';
import type { TransferInfo } from '../model/types';
import { getDistanceMeters } from '../../../shared/lib/geofence';
import { calcWalkingSeconds, formatWalkingTime } from '../../../shared/lib/walkingTime';

/**
 * 경로의 모든 환승 지점 정보를 미리 계산합니다.
 *
 * 대중교통 구간 → 다음 대중교통 구간 사이에 환승이 존재합니다.
 * 사이에 도보 구간이 있으면 도보 거리/시간을 사용하고,
 * 없으면 두 구간의 좌표 거리로 계산합니다.
 */
export function buildTransferInfoList(subPaths: OdsaySubPath[]): TransferInfo[] {
  const transfers: TransferInfo[] = [];

  for (let i = 0; i < subPaths.length; i++) {
    const current = subPaths[i];
    if (current.trafficType === 3) continue; // 도보 구간은 스킵

    // 다음 대중교통 구간 찾기
    let walkDistance = 0;
    let nextTransitIndex = -1;

    for (let j = i + 1; j < subPaths.length; j++) {
      if (subPaths[j].trafficType === 3) {
        // 도보 구간의 거리 누적
        walkDistance += subPaths[j].distance;
      } else {
        nextTransitIndex = j;
        break;
      }
    }

    if (nextTransitIndex === -1) continue; // 마지막 대중교통 구간

    const nextTransit = subPaths[nextTransitIndex];

    // 도보 구간이 없으면 좌표 거리로 계산
    if (walkDistance === 0) {
      walkDistance = getDistanceMeters(
        current.endY,
        current.endX,
        nextTransit.startY,
        nextTransit.startX,
      );
    }

    const walkSeconds = calcWalkingSeconds(walkDistance);
    const nextLane = nextTransit.lane?.[0];

    transfers.push({
      fromSubPathIndex: i,
      exitStopName: current.endName,
      nextTrafficType: nextTransit.trafficType,
      nextLaneName: nextLane?.name ?? nextLane?.busNo ?? '다음 노선',
      nextBoardingStop: nextTransit.startName,
      walkingDistance: Math.round(walkDistance),
      walkingSeconds: walkSeconds,
      walkingTimeFormatted: formatWalkingTime(walkSeconds),
    });
  }

  return transfers;
}

/**
 * 현재 구간에 해당하는 환승 정보를 반환합니다.
 */
export function getTransferForSubPath(
  transfers: TransferInfo[],
  subPathIndex: number,
): TransferInfo | null {
  return transfers.find((t) => t.fromSubPathIndex === subPathIndex) ?? null;
}
