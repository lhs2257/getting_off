import { fetchOdsayApi } from '../../../shared/api';
import type { OdsayRouteResponse, OdsayPath } from '../../../entities/route/model/types';

/**
 * ODsay 대중교통 경로 탐색
 *
 * @param sx - 출발지 경도
 * @param sy - 출발지 위도
 * @param ex - 도착지 경도
 * @param ey - 도착지 위도
 */
export async function searchRoute(
  sx: number,
  sy: number,
  ex: number,
  ey: number,
): Promise<OdsayPath[]> {
  const data = await fetchOdsayApi<OdsayRouteResponse>(
    '/searchPubTransPathT',
    { SX: sx, SY: sy, EX: ex, EY: ey },
  );

  return data.result?.path ?? [];
}
