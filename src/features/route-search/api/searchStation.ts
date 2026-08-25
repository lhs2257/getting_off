import { fetchKakaoLocal } from '../../../shared/api';
import type { OdsayStation } from '../../../entities/route/model/types';

/**
 * 카카오 로컬 API 키워드 검색 응답
 */
interface KakaoKeywordResponse {
  documents: KakaoPlace[];
}

interface KakaoPlace {
  id: string;
  place_name: string;
  category_group_code: string;
  category_name: string;
  x: string; // 경도
  y: string; // 위도
  road_address_name: string;
}

/**
 * 카카오 키워드 검색으로 역/정류장 검색
 *
 * category_group_code: SW8(지하철역), BK9(은행) 등
 * 교통 관련 카테고리로 필터링합니다.
 */
export async function searchStation(
  stationName: string,
): Promise<OdsayStation[]> {
  const data = await fetchKakaoLocal<KakaoKeywordResponse>(
    '/v2/local/search/keyword.json',
    {
      query: stationName,
      category_group_code: 'SW8,BK9',
      size: 15,
    },
  );

  // 카테고리 필터링이 부족할 수 있으므로 일반 검색도 병행
  const generalData = await fetchKakaoLocal<KakaoKeywordResponse>(
    '/v2/local/search/keyword.json',
    {
      query: `${stationName} 역 정류장`,
      size: 10,
    },
  );

  const allPlaces = [...data.documents, ...generalData.documents];

  // 중복 제거
  const seen = new Set<string>();
  const unique = allPlaces.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return unique.map(toOdsayStation);
}

function toOdsayStation(place: KakaoPlace): OdsayStation {
  const isSubway = place.category_name?.includes('지하철') ||
    place.place_name.includes('역');
  const laneName = isSubway
    ? extractLaneName(place.category_name)
    : undefined;

  return {
    stationName: place.place_name,
    stationID: parseInt(place.id, 10) || 0,
    x: parseFloat(place.x),
    y: parseFloat(place.y),
    CID: 1000,
    arsID: place.id,
    type: isSubway ? 2 : 1,
    laneName,
  };
}

/**
 * 카테고리명에서 호선명 추출
 * 예: "교통,수송 > 지하철,전철 > 수도권2호선" -> "2호선"
 */
function extractLaneName(categoryName: string): string | undefined {
  const match = categoryName?.match(/(\d+호선|[가-힣]+선)/);
  return match?.[1];
}
