//import fsp from 'node:fs/promises';  2025-03-22 15:24 コピー処理削除直接参照
//import os from 'node:os';  2025-03-22 15:24 コピー処理削除直接参照
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@libsql/client';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { drizzle } from 'drizzle-orm/libsql';

const SQLITE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database.sqlite');

let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDatabase() {
  if (database == null) {
    throw new Error('database is initializing.');
  }
  return database;
}

export async function initializeDatabase(): Promise<void> {
  if (database) {
    return; //2025-03-22 15:24 コピー処理削除直接参照, 既に初期化済みの場合は何もしない
  }

//  database?.$client.close();
//  database = null;

//  const TEMP_PATH = path.resolve(await fsp.mkdtemp(path.resolve(os.tmpdir(), './wsh-')), './database.sqlite');
//  await fsp.copyFile(SQLITE_PATH, TEMP_PATH);

  database = drizzle({
    client: createClient({
      syncInterval: 1000,
      url: `file:${SQLITE_PATH}`, //2025-03-22 15:24 コピー処理削除直接参照
    }),
    schema,
  });
}
