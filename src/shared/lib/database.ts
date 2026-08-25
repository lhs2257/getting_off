import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * SQLite 데이터베이스 인스턴스를 반환합니다.
 * 최초 호출 시 DB를 열고 스키마를 초기화합니다.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('getting_off.db');
  await initSchema(db);
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS saved_routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      departure_name TEXT NOT NULL,
      departure_station_id INTEGER NOT NULL,
      departure_x REAL NOT NULL,
      departure_y REAL NOT NULL,
      departure_type INTEGER NOT NULL,
      arrival_name TEXT NOT NULL,
      arrival_station_id INTEGER NOT NULL,
      arrival_x REAL NOT NULL,
      arrival_y REAL NOT NULL,
      arrival_type INTEGER NOT NULL,
      path_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
