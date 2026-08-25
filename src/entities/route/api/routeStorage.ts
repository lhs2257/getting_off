import { getDatabase } from '../../../shared/lib/database';
import type { SavedRoute, RouteStation } from '../model/SavedRoute';
import type { OdsayPath } from '../model/types';

/**
 * 경로 저장
 */
export async function saveRoute(
  name: string,
  departure: RouteStation,
  arrival: RouteStation,
  path: OdsayPath,
): Promise<number> {
  const db = await getDatabase();

  const result = await db.runAsync(
    `INSERT INTO saved_routes
      (name, departure_name, departure_station_id, departure_x, departure_y, departure_type,
       arrival_name, arrival_station_id, arrival_x, arrival_y, arrival_type, path_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    name,
    departure.name,
    departure.stationId,
    departure.x,
    departure.y,
    departure.type,
    arrival.name,
    arrival.stationId,
    arrival.x,
    arrival.y,
    arrival.type,
    JSON.stringify(path),
  );

  return result.lastInsertRowId;
}

/**
 * 저장된 경로 전체 조회 (최신순)
 */
export async function getAllRoutes(): Promise<SavedRoute[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM saved_routes ORDER BY updated_at DESC',
  );

  return rows.map(mapRowToRoute);
}

/**
 * 저장된 경로 단건 조회
 */
export async function getRouteById(id: number): Promise<SavedRoute | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM saved_routes WHERE id = ?',
    id,
  );

  return row ? mapRowToRoute(row) : null;
}

/**
 * 경로 삭제
 */
export async function deleteRoute(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM saved_routes WHERE id = ?', id);
}

/**
 * DB row -> SavedRoute 변환
 */
function mapRowToRoute(row: Record<string, unknown>): SavedRoute {
  return {
    id: row.id as number,
    name: row.name as string,
    departure: {
      name: row.departure_name as string,
      stationId: row.departure_station_id as number,
      x: row.departure_x as number,
      y: row.departure_y as number,
      type: row.departure_type as number,
    },
    arrival: {
      name: row.arrival_name as string,
      stationId: row.arrival_station_id as number,
      x: row.arrival_x as number,
      y: row.arrival_y as number,
      type: row.arrival_type as number,
    },
    path: JSON.parse(row.path_json as string),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
