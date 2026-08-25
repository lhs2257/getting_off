import { fetchKakaoLocal } from '../../../shared/api';
import type { OdsayStation } from '../../../entities/route/model/types';

interface KakaoKeywordResponse {
  documents: KakaoPlace[];
}

interface KakaoPlace {
  id: string;
  place_name: string;
  category_group_code: string;
  category_name: string;
  x: string;
  y: string;
}

/**
 * 카카오 키워드 검색으로 역/정류장 검색
 */
export async function searchStation(
  stationName: string,
): Promise<OdsayStation[]> {
  const data = await fetchKakaoLocal<KakaoKeywordResponse>(
    '/v2/local/search/keyword.json',
    { query: stationName, size: 15 },
  );

  return data.documents.map(toOdsayStation);
}

function toOdsayStation(place: KakaoPlace): OdsayStation {
  const isSubway =
    place.category_name?.includes('지하철') ||
    place.category_group_code === 'SW8';

  return {
    stationName: place.place_name,
    stationID: parseInt(place.id, 10) || 0,
    x: parseFloat(place.x),
    y: parseFloat(place.y),
    CID: 1000,
    arsID: place.id,
    type: isSubway ? 2 : 1,
    laneName: isSubway ? extractLaneName(place.category_name) : undefined,
  };
}

function extractLaneName(categoryName: string): string | undefined {
  const match = categoryName?.match(/(\d+호선|[가-힣]+선)/);
  return match?.[1];
}
