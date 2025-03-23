import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@libsql/client';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { drizzle } from 'drizzle-orm/libsql';

const SQLITE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database.sqlite');

let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

// キャッシュの実装
type QueryCache = {
  [key: string]: {
    data: any;
    timestamp: number;
  };
};

const queryCache: QueryCache = {};
const CACHE_TTL = 60000; // 1分のキャッシュ有効期限

export function getDatabase() {
  if (database == null) {
    throw new Error('database is initializing.');
  }
  return database;
}

// キャッシュされたクエリを実行する関数
export async function executeWithCache<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  ttl = CACHE_TTL
): Promise<T> {
  const now = Date.now();
  const cachedResult = queryCache[cacheKey];
  
  if (cachedResult && now - cachedResult.timestamp < ttl) {
    return cachedResult.data as T;
  }
  
  const result = await queryFn();
  queryCache[cacheKey] = {
    data: result,
    timestamp: now,
  };
  
  return result;
}

// キャッシュをクリアする関数
export function clearCache(keyPattern?: string): void {
  if (keyPattern) {
    const regex = new RegExp(keyPattern);
    Object.keys(queryCache).forEach(key => {
      if (regex.test(key)) {
        delete queryCache[key];
      }
    });
  } else {
    Object.keys(queryCache).forEach(key => {
      delete queryCache[key];
    });
  }
}

export async function initializeDatabase(): Promise<void> {
  database?.$client.close();
  database = null;

  const TEMP_PATH = path.resolve(await fsp.mkdtemp(path.resolve(os.tmpdir(), './wsh-')), './database.sqlite');
  await fsp.copyFile(SQLITE_PATH, TEMP_PATH);

  database = drizzle({
    client: createClient({
      syncInterval: 1000,
      url: `file:${TEMP_PATH}`,
    }),
    schema,
  });
  
  // データベース初期化時にキャッシュをクリア
  clearCache();
}
