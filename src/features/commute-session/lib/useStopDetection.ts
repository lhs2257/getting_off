import { useEffect, useRef, useCallback } from 'react';
import type { LocationState } from '../../../shared/hooks/useLocationTracking';
import type { OdsaySubPath, OdsayPassStation } from '../../../entities/route/model/types';
import {
  getDistanceMeters,
  findNearestIndex,
  STOP_ARRIVAL_RADIUS,
  STOP_APPROACHING_RADIUS,
} from '../../../shared/lib/geofence';
import { useCommuteStore } from '../model/useCommuteStore';
import {
  notifyApproaching,
  notifyArrived,
  notifyExitStop,
  notifyTransfer,
} from '../../../services/notification/commuteAlert';

export type StopStatus = 'far' | 'approaching' | 'arrived';

interface StopDetectionResult {
  currentStopName: string | null;
  stopStatus: StopStatus;
  remainingStops: number;
  distanceToNext: number | null;
}

/**
 * 위치 기반 정거장 감지 훅
 *
 * 현재 위치를 활성 구간의 정거장 좌표와 비교하여
 * 가장 가까운 정거장과 상태를 반환합니다.
 */
export function useStopDetection(
  location: LocationState | null,
  subPath: OdsaySubPath | null,
): StopDetectionResult {
  const { setCurrentStopIndex, advanceSubPath, route, currentSubPathIndex } =
    useCommuteStore();
  const lastDetectedIndex = useRef(-1);
  const lastNotifiedStatus = useRef<StopStatus>('far');

  const defaultResult: StopDetectionResult = {
    currentStopName: null,
    stopStatus: 'far',
    remainingStops: 0,
    distanceToNext: null,
  };

  const detectStop = useCallback((): StopDetectionResult => {
    if (!location || !subPath) return defaultResult;

    // 도보 구간은 정거장 감지 불필요 - 도착지 거리만 체크
    if (subPath.trafficType === 3) {
      const distToEnd = getDistanceMeters(
        location.latitude,
        location.longitude,
        subPath.endY,
        subPath.endX,
      );

      if (distToEnd < STOP_ARRIVAL_RADIUS) {
        // 도보 구간 종료, 다음 구간으로 이동
        const totalSubPaths = route?.path.subPath.length ?? 0;
        if (currentSubPathIndex < totalSubPaths - 1) {
          advanceSubPath();
        }
        return {
          currentStopName: subPath.endName,
          stopStatus: 'arrived',
          remainingStops: 0,
          distanceToNext: distToEnd,
        };
      }

      return {
        currentStopName: null,
        stopStatus: distToEnd < STOP_APPROACHING_RADIUS ? 'approaching' : 'far',
        remainingStops: 0,
        distanceToNext: distToEnd,
      };
    }

    // 대중교통 구간: passStopList에서 가장 가까운 정거장 찾기
    const stations = subPath.passStopList?.stations;
    if (!stations || stations.length === 0) {
      // passStopList가 없으면 출발/도착 좌표만으로 판단
      const distToEnd = getDistanceMeters(
        location.latitude,
        location.longitude,
        subPath.endY,
        subPath.endX,
      );

      return {
        currentStopName: null,
        stopStatus: distToEnd < STOP_APPROACHING_RADIUS ? 'approaching' : 'far',
        remainingStops: subPath.stationCount,
        distanceToNext: distToEnd,
      };
    }

    const nearest = findNearestIndex(
      location.latitude,
      location.longitude,
      stations,
    );

    if (!nearest) return defaultResult;

    const { index, distance } = nearest;
    const currentStation = stations[index];
    const lastStationIndex = stations.length - 1;
    const remaining = lastStationIndex - index;

    // 정거장 도착 판정
    if (distance < STOP_ARRIVAL_RADIUS && index !== lastDetectedIndex.current) {
      lastDetectedIndex.current = index;
      setCurrentStopIndex(index);

      // 마지막 정거장(하차역) 도착
      if (index >= lastStationIndex) {
        const totalSubPaths = route?.path.subPath.length ?? 0;
        const nextSubPath = route?.path.subPath[currentSubPathIndex + 1];

        notifyExitStop(currentStation.stationName);

        // 다음 구간이 있으면 환승 안내
        if (nextSubPath && nextSubPath.trafficType !== 3) {
          const nextLane = nextSubPath.lane?.[0]?.name ?? nextSubPath.lane?.[0]?.busNo ?? '다음 노선';
          notifyTransfer(currentStation.stationName, nextLane);
        }

        if (currentSubPathIndex < totalSubPaths - 1) {
          advanceSubPath();
        }
      } else {
        notifyArrived(currentStation.stationName);
      }
    } else if (
      distance < STOP_APPROACHING_RADIUS &&
      distance >= STOP_ARRIVAL_RADIUS &&
      lastNotifiedStatus.current === 'far' &&
      remaining <= 2 &&
      remaining > 0
    ) {
      // 하차역 2정거장 전 접근 알림 (1회)
      lastNotifiedStatus.current = 'approaching';
      notifyApproaching(currentStation.stationName, remaining);
    }

    let stopStatus: StopStatus = 'far';
    if (distance < STOP_ARRIVAL_RADIUS) {
      stopStatus = 'arrived';
    } else if (distance < STOP_APPROACHING_RADIUS) {
      stopStatus = 'approaching';
    }

    return {
      currentStopName: currentStation.stationName,
      stopStatus,
      remainingStops: remaining,
      distanceToNext: distance,
    };
  }, [location, subPath, route, currentSubPathIndex, setCurrentStopIndex, advanceSubPath]);

  const result = detectStop();

  // 구간이 바뀌면 감지 상태 리셋
  useEffect(() => {
    lastDetectedIndex.current = -1;
    lastNotifiedStatus.current = 'far';
  }, [currentSubPathIndex]);

  return result;
}
