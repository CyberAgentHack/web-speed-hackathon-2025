import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@libsql/client';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { drizzle } from 'drizzle-orm/libsql';

const SQLITE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database.sqlite');

let database: ReturnType<typeof drizzle<typeof schema>> | null = null;
let tempDbPath: string | null = null; // 一時ファイルのパスをキャッシュする変数

export function getDatabase() {
  if (database == null) {
    throw new Error('database is initializing.');
  }
  return database;
}

export async function initializeDatabase(): Promise<void> {
  database?.$client.close();
  database = null;

  if (!tempDbPath) {
    // 一時ディレクトリを作成し、その中にデータベースファイルをコピーしてキャッシュする
    const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'wsh-'));
    tempDbPath = path.resolve(tmpDir, 'database.sqlite');
    await fsp.copyFile(SQLITE_PATH, tempDbPath);
  }

  database = drizzle({
    client: createClient({
      syncInterval: 1000,
      url: `file:${tempDbPath}`,
    }),
    schema,
  });
}

