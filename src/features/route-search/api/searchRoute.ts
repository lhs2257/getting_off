import { fetchKakaoLocal } from '../../../shared/api';
import type { OdsayPath, OdsayPathInfo, OdsaySubPath, OdsayLane } from '../../../entities/route/model/types';

/**
 * 카카오 대중교통 경로 탐색 응답
 */
interface KakaoTransitResponse {
  routes: KakaoRoute[];
}

interface KakaoRoute {
  result_code: number;
  summary: {
    origin: KakaoPoint;
    destination: KakaoPoint;
    distance: number;
    duration: number;
    fare: { regular: number; taxi: number };
  };
  sections: KakaoSection[];
}

interface KakaoSection {
  type: number; // 1:도보, 2:버스, 3:지하철
  distance: number;
  duration: number;
  routes?: KakaoTransitRoute[];
  steps?: KakaoStep[];
}

interface KakaoTransitRoute {
  name: string;
  type: string;
  stations: KakaoTransitStation[];
}

interface KakaoTransitStation {
  name: string;
  x: number;
  y: number;
}

interface KakaoStep {
  distance: number;
  duration: number;
}

interface KakaoPoint {
  name: string;
  x: number;
  y: number;
}

/**
 * 카카오 대중교통 길찾기
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
  const data = await fetchKakaoLocal<KakaoTransitResponse>(
    '/v2/local/search/keyword.json',
    {},
  ).catch(() => null);

  // 카카오 모빌리티 대중교통 API 호출
  const response = await fetch(
    `https://apis-navi.kakaomobility.com/v1/directions/transit?origin=${sx},${sy}&destination=${ex},${ey}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_API_KEY ?? ''}`,
      },
    },
  );

  if (!response.ok) {
    // 카카오 모빌리티 실패 시 카카오 로컬 키워드 기반 간이 경로 생성
    return createSimpleRoute(sx, sy, ex, ey);
  }

  const result: KakaoTransitResponse = await response.json();

  if (!result.routes || result.routes.length === 0) {
    return createSimpleRoute(sx, sy, ex, ey);
  }

  return result.routes
    .filter((r) => r.result_code === 0)
    .map(toOdsayPath);
}

/**
 * 카카오 경로를 OdsayPath로 변환
 */
function toOdsayPath(route: KakaoRoute): OdsayPath {
  const subPaths = route.sections.map(toOdsaySubPath);

  const busCount = subPaths.filter((sp) => sp.trafficType === 2).length;
  const subwayCount = subPaths.filter((sp) => sp.trafficType === 1).length;
  const totalStations = subPaths.reduce((sum, sp) => sum + sp.stationCount, 0);
  const totalWalk = subPaths
    .filter((sp) => sp.trafficType === 3)
    .reduce((sum, sp) => sum + sp.distance, 0);

  let pathType = 3; // 복합
  if (busCount > 0 && subwayCount === 0) pathType = 2;
  if (subwayCount > 0 && busCount === 0) pathType = 1;

  const info: OdsayPathInfo = {
    trafficDistance: route.summary.distance,
    totalTime: Math.round(route.summary.duration / 60),
    payment: route.summary.fare.regular,
    busTransitCount: Math.max(0, busCount - 1),
    subwayTransitCount: Math.max(0, subwayCount - 1),
    mapObj: '',
    firstStartStation: subPaths[0]?.startName ?? '',
    lastEndStation: subPaths[subPaths.length - 1]?.endName ?? '',
    totalStationCount: totalStations,
    busStationCount: subPaths.filter((sp) => sp.trafficType === 2).reduce((s, sp) => s + sp.stationCount, 0),
    subwayStationCount: subPaths.filter((sp) => sp.trafficType === 1).reduce((s, sp) => s + sp.stationCount, 0),
    totalDistance: route.summary.distance,
    totalWalk,
  };

  return { pathType, info, subPath: subPaths };
}

function toOdsaySubPath(section: KakaoSection): OdsaySubPath {
  // 카카오 type: 1=도보, 2=버스, 3=지하철
  // ODsay trafficType: 1=지하철, 2=버스, 3=도보
  const trafficTypeMap: Record<number, number> = { 1: 3, 2: 2, 3: 1 };
  const trafficType = trafficTypeMap[section.type] ?? 3;

  const route = section.routes?.[0];
  const stations = route?.stations ?? [];

  const startStation = stations[0];
  const endStation = stations[stations.length - 1];

  const lane: OdsayLane[] = route
    ? [{ name: route.name, busNo: route.name }]
    : [];

  return {
    trafficType,
    distance: section.distance,
    sectionTime: Math.round(section.duration / 60),
    stationCount: Math.max(0, stations.length - 1),
    lane: lane.length > 0 ? lane : undefined,
    startName: startStation?.name ?? '',
    startX: startStation?.x ?? 0,
    startY: startStation?.y ?? 0,
    endName: endStation?.name ?? '',
    endX: endStation?.x ?? 0,
    endY: endStation?.y ?? 0,
    passStopList: stations.length > 0
      ? {
          stations: stations.map((st, i) => ({
            stationName: st.name,
            stationID: i,
            x: st.x,
            y: st.y,
            index: i,
          })),
        }
      : undefined,
  };
}

/**
 * API 실패 시 출발/도착 좌표 기반 간이 경로 생성
 */
function createSimpleRoute(
  sx: number,
  sy: number,
  ex: number,
  ey: number,
): OdsayPath[] {
  const R = 6371000;
  const dLat = ((ey - sy) * Math.PI) / 180;
  const dLon = ((ex - sx) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((sy * Math.PI) / 180) *
      Math.cos((ey * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const timeMin = Math.round(dist / 500); // 대략 30km/h 기준

  return [
    {
      pathType: 3,
      info: {
        trafficDistance: Math.round(dist),
        totalTime: timeMin,
        payment: 1400,
        busTransitCount: 0,
        subwayTransitCount: 0,
        mapObj: '',
        firstStartStation: '출발지',
        lastEndStation: '도착지',
        totalStationCount: 0,
        busStationCount: 0,
        subwayStationCount: 0,
        totalDistance: Math.round(dist),
        totalWalk: 0,
      },
      subPath: [
        {
          trafficType: 3,
          distance: Math.round(dist),
          sectionTime: timeMin,
          stationCount: 0,
          startName: '출발지',
          startX: sx,
          startY: sy,
          endName: '도착지',
          endX: ex,
          endY: ey,
        },
      ],
    },
  ];
}
