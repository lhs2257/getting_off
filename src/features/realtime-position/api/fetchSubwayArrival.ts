import { fetchSeoulApi } from '../../../shared/api';
import type {
  SeoulSubwayArrivalResponse,
  SeoulSubwayArrival,
  RealtimeArrival,
} from '../../../entities/stop/model/types';

/**
 * 서울시 지하철 실시간 도착정보 조회
 *
 * @param stationName - 역명 (예: "강남")
 */
export async function fetchSubwayArrival(
  stationName: string,
): Promise<RealtimeArrival[]> {
  const data = await fetchSeoulApi<SeoulSubwayArrivalResponse>(
    `realtimeStationArrival/${encodeURIComponent(stationName)}`,
    0,
    10,
  );

  const items = data?.realtimeArrivalList ?? [];

  return items.map(toSubwayRealtimeArrival);
}

function toSubwayRealtimeArrival(item: SeoulSubwayArrival): RealtimeArrival {
  const seconds = parseInt(item.barvlDt, 10) || 0;
  const arrivingCodes = ['0', '1']; // 진입, 도착

  return {
    type: 'subway',
    lineName: item.trainLineNm,
    destination: item.bstatnNm,
    arrivalMessage: item.arvlMsg2 || '정보 없음',
    arrivalSeconds: seconds,
    isArriving: arrivingCodes.includes(item.arvlCd) || seconds <= 60,
  };
}
