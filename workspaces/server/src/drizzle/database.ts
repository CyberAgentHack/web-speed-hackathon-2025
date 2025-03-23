import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@libsql/client';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { sql } from 'drizzle-orm';
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
}

/**
 * 生のSQLクエリを実行するヘルパー関数
 */
export async function execSQL(query: string): Promise<void> {
  const db = getDatabase();
  try {
    // drizzleでのSQL実行
    await db.run(sql.raw(query));
  } catch (error) {
    console.error('SQLクエリ実行エラー:', query, error);
    throw error;
  }
}
