import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@libsql/client';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { drizzle } from 'drizzle-orm/libsql';

const SQLITE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database.sqlite');

let database = null as ReturnType<typeof drizzle<typeof schema>> | null;

export function getDatabase() {
  if (!database) {
    throw new Error('Database has not been initialized');
  }
  return database;
}

export async function initializeDatabase(): Promise<void> {
  if (database) {
    return;
  }

  const client = createClient({
    url: `file:${SQLITE_PATH}`,
    syncInterval: 5000, // デフォルト1000ms → 更新頻度を下げて I/O 負荷軽減

    concurrency: 0,
  });

  database = drizzle({ client, schema });

  // パフォーマンス向上用 PRAGMA
  await database.$client.execute(`PRAGMA journal_mode = WAL`);
  await database.$client.execute(`PRAGMA synchronous = NORMAL`);
}
