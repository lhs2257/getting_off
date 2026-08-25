/**
 * ODsay 역/정류장 검색 응답
 */
export interface OdsayStationResponse {
  result: {
    station: OdsayStation[];
  };
}

export interface OdsayStation {
  stationName: string;
  stationID: number;
  x: number; // 경도
  y: number; // 위도
  CID: number; // 도시 코드
  arsID: string; // 정류장 고유번호
  type: number; // 1: 버스, 2: 지하철
  laneName?: string; // 호선명 (지하철)
}

/**
 * ODsay 대중교통 경로 탐색 응답
 */
export interface OdsayRouteResponse {
  result: {
    searchType: number;
    outTrafficCheck: number;
    busCount: number;
    subwayCount: number;
    subwayBusCount: number;
    path: OdsayPath[];
  };
}

export interface OdsayPath {
  pathType: number; // 1: 지하철, 2: 버스, 3: 지하철+버스
  info: OdsayPathInfo;
  subPath: OdsaySubPath[];
}

export interface OdsayPathInfo {
  trafficDistance: number; // 총 거리 (m)
  totalTime: number; // 총 소요시간 (분)
  payment: number; // 요금
  busTransitCount: number; // 버스 환승 횟수
  subwayTransitCount: number; // 지하철 환승 횟수
  mapObj: string;
  firstStartStation: string;
  lastEndStation: string;
  totalStationCount: number;
  busStationCount: number;
  subwayStationCount: number;
  totalDistance: number;
  totalWalk: number; // 도보 거리 (m)
}

export interface OdsaySubPath {
  trafficType: number; // 1: 지하철, 2: 버스, 3: 도보
  distance: number;
  sectionTime: number; // 구간 소요시간 (분)
  stationCount: number;
  lane?: OdsayLane[];
  startName: string;
  startX: number;
  startY: number;
  endName: string;
  endX: number;
  endY: number;
  startID?: number;
  endID?: number;
  passStopList?: {
    stations: OdsayPassStation[];
  };
}

export interface OdsayLane {
  name: string;
  subwayCode?: number;
  busNo?: string;
  type?: number;
}

export interface OdsayPassStation {
  stationName: string;
  stationID: number;
  x: number;
  y: number;
  index: number;
}
