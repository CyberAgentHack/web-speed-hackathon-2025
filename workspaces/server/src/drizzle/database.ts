import fsp from 'node:fs/promises';
import os from 'node:os';
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
  // 既存のデータベースをクローズして新しいインスタンスを作成
  database?.$client.close();
  database = null;

  const TEMP_PATH = path.resolve(await fsp.mkdtemp(path.resolve(os.tmpdir(), './wsh-')), './database.sqlite');
  await fsp.copyFile(SQLITE_PATH, TEMP_PATH);

  // Drizzleインスタンスの初期化
  database = drizzle({
    client: createClient({
      syncInterval: 1000,
      url: `file:${TEMP_PATH}`,
    }),
    schema,
  });

  // インデックス作成処理の追加
  await createIndexes();
}

// インデックス作成のための関数
async function createIndexes(): Promise<void> {
  const client = database?.$client;

  if (!client) {
    throw new Error('Database client not initialized.');
  }

  // インデックス作成SQLクエリ
  const createIndexQueries = [
    // recommendedModuleテーブルにインデックスを作成
    `CREATE INDEX IF NOT EXISTS idx_recommendedModule_referenceId ON recommendedModule (referenceId);`,
    // recommendedItemテーブルにインデックスを作成
    `CREATE INDEX IF NOT EXISTS idx_recommendedItem_moduleId ON recommendedItem (moduleId);`,
    `CREATE INDEX IF NOT EXISTS idx_recommendedItem_seriesId ON recommendedItem (seriesId);`,
    `CREATE INDEX IF NOT EXISTS idx_recommendedItem_episodeId ON recommendedItem (episodeId);`,
    // programテーブルにインデックスを作成
    `CREATE INDEX IF NOT EXISTS idx_program_channelId ON program (channelId);`,
    `CREATE INDEX IF NOT EXISTS idx_program_episodeId ON program (episodeId);`,
    // episodeテーブルにインデックスを作成
    `CREATE INDEX IF NOT EXISTS idx_episode_seriesId ON episode (seriesId);`,
    `CREATE INDEX IF NOT EXISTS idx_episode_streamId ON episode (streamId);`,
  ];

  // インデックス作成クエリを実行
  for (const query of createIndexQueries) {
    await client.execute(query);
  }
}
