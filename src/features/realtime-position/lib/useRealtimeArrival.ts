import { useState, useEffect, useRef } from 'react';
import type { OdsaySubPath } from '../../../entities/route/model/types';
import type { RealtimeArrival } from '../../../entities/stop/model/types';
import { fetchBusArrival } from '../api/fetchBusArrival';
import { fetchSubwayArrival } from '../api/fetchSubwayArrival';

const POLL_INTERVAL = 30_000; // 30초

/**
 * 현재 구간의 실시간 도착정보를 주기적으로 조회합니다.
 *
 * @param subPath - 현재 활성 구간
 * @param active - 폴링 활성 여부
 */
export function useRealtimeArrival(
  subPath: OdsaySubPath | null,
  active: boolean,
) {
  const [arrivals, setArrivals] = useState<RealtimeArrival[]>([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active || !subPath || subPath.trafficType === 3) {
      setArrivals([]);
      return;
    }

    async function fetch() {
      setLoading(true);
      try {
        let result: RealtimeArrival[] = [];

        if (subPath!.trafficType === 2) {
          // 버스: arsId로 조회
          const arsId = subPath!.startID?.toString() ?? '';
          if (arsId) {
            result = await fetchBusArrival(arsId);
          }
        } else if (subPath!.trafficType === 1) {
          // 지하철: 역명으로 조회
          const stationName = subPath!.startName;
          if (stationName) {
            result = await fetchSubwayArrival(stationName);
          }
        }

        setArrivals(result);
      } catch {
        setArrivals([]);
      } finally {
        setLoading(false);
      }
    }

    fetch();
    intervalRef.current = setInterval(fetch, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [subPath, active]);

  return { arrivals, loading };
}
