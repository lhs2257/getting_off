import { fetchOdsayApi } from '../../../shared/api';
import type { OdsayStationResponse, OdsayStation } from '../../../entities/route/model/types';

/**
 * ODsay 역/정류장 이름 검색
 *
 * @param stationName - 검색어 (역/정류장명)
 * @param cityCode - 도시 코드 (1000: 수도권, 기본값)
 */
export async function searchStation(
  stationName: string,
  cityCode = 1000,
): Promise<OdsayStation[]> {
  const data = await fetchOdsayApi<OdsayStationResponse>(
    '/searchStation',
    { stationName, CID: cityCode },
  );

  return data.result?.station ?? [];
}
