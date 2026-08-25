import { fetchSeoulApi } from '../../../shared/api';
import type {
  SeoulBusArrivalResponse,
  SeoulBusArrival,
  RealtimeArrival,
} from '../../../entities/stop/model/types';

/**
 * 서울시 버스 도착정보 조회
 *
 * @param stationId - 정류소 ID (arsId)
 */
export async function fetchBusArrival(
  stationId: string,
): Promise<RealtimeArrival[]> {
  const data = await fetchSeoulApi<SeoulBusArrivalResponse>(
    'getArrInfoByRouteAll',
    1,
    20,
  );

  const items = data?.msgBody?.itemList ?? [];
  const filtered = items.filter((item) => item.arsId === stationId);

  return filtered.map(toBusRealtimeArrival);
}

/**
 * 서울시 버스 도착정보 (정류소 ID 기반)
 *
 * @param stId - 정류소 고유 ID (숫자)
 */
export async function fetchBusArrivalByStId(
  stId: string,
): Promise<RealtimeArrival[]> {
  const data = await fetchSeoulApi<SeoulBusArrivalResponse>(
    'getArrInfoByRouteAll',
    1,
    20,
  );

  const items = data?.msgBody?.itemList ?? [];
  const filtered = items.filter((item) => item.stId === stId);

  return filtered.map(toBusRealtimeArrival);
}

function toBusRealtimeArrival(item: SeoulBusArrival): RealtimeArrival {
  const seconds = parseInt(item.traTime1, 10) || 0;

  return {
    type: 'bus',
    lineName: item.rtNm,
    destination: item.busRouteAbrv,
    arrivalMessage: item.arrmsg1 || '정보 없음',
    arrivalSeconds: seconds,
    isArriving: item.isArrive1 === '1' || seconds <= 60,
  };
}
