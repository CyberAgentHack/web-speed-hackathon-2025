import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@libsql/client';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { drizzle } from 'drizzle-orm/libsql';

const SQLITE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database.sqlite');

let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

// キャッシュ用のマップを追加
const queryCache = new Map<string, any>();
const CACHE_TTL = 3600000;

export function getDatabase() {
  if (database == null) {
    throw new Error('database is initializing.');
  }
  return database;
}

// キャッシュ用の関数
export function getCachedQuery<T>(key: string, queryFn: () => Promise<T>, ttl = CACHE_TTL): Promise<T> {
  const cachedItem = queryCache.get(key);
  if (cachedItem && cachedItem.expiry > Date.now()) {
    return Promise.resolve(cachedItem.data);
  }

  return queryFn().then((result) => {
    queryCache.set(key, {
      data: result,
      expiry: Date.now() + ttl,
    });
    return result;
  });
}

export async function initializeDatabase(): Promise<void> {
  database?.$client.close();
  database = null;
  queryCache.clear();

  const TEMP_PATH = path.resolve(await fsp.mkdtemp(path.resolve(os.tmpdir(), './wsh-')), './database.sqlite');
  await fsp.copyFile(SQLITE_PATH, TEMP_PATH);

  database = drizzle({
    client: createClient({
      syncInterval: 1000,
      url: `file:${TEMP_PATH}`,
    }),
    schema,
  });
}
