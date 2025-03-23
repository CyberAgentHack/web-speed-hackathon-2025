import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@libsql/client';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import * as databaseSchema from '@wsh-2025/schema/src/database/schema';

const SQLITE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database.sqlite');

let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDatabase() {
  if (database == null) {
    throw new Error('database is initializing.');
  }
  return database;
}

async function addSeriesIdToPrograms() {
  const db = getDatabase();
  const programs = await db.query.program.findMany();
  for (const program of programs) {
    const joinedEpisode = await db.query.episode.findFirst({
      where(episode, { eq }) {
        return eq(episode.id, program.episodeId);
      },
    });
    
    const seriesId = joinedEpisode?.seriesId;
    if (seriesId) {
      await db
        .update(databaseSchema.program)
        .set({ seriesId })
        .where(eq(databaseSchema.program.id, program.id))
        .execute();
    }
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

  await addSeriesIdToPrograms();

  // index貼る
  await database.$client.execute('CREATE INDEX IF NOT EXISTS episode_series_id ON episode (seriesId)');
  await database.$client.execute('CREATE INDEX IF NOT EXISTS program_series_id ON program (seriesId)');
}
