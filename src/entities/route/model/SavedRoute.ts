import type { OdsayPath, OdsayStation } from './types';

/**
 * 저장된 경로 도메인 모델
 */
export interface SavedRoute {
  id: number;
  name: string;
  departure: RouteStation;
  arrival: RouteStation;
  path: OdsayPath;
  createdAt: string;
  updatedAt: string;
}

export interface RouteStation {
  name: string;
  stationId: number;
  x: number;
  y: number;
  type: number; // 1: 버스, 2: 지하철
}

/**
 * OdsayStation -> RouteStation 변환
 */
export function toRouteStation(station: OdsayStation): RouteStation {
  return {
    name: station.stationName,
    stationId: station.stationID,
    x: station.x,
    y: station.y,
    type: station.type,
  };
}
