import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { env } from 'node:process';
import { fileURLToPath } from 'node:url';

import { createClient } from '@libsql/client';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { drizzle } from 'drizzle-orm/libsql';

const SQLITE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database.sqlite');

let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

const debug = env['DEBUG']?.split(',').includes('drizzle');

export function getDatabase() {
  if (database == null) {
    throw new Error('database is initializing.');
  }
  return database;
}

export async function initializeDatabase(): Promise<void> {
  if (debug) console.debug('initializeDatabase');

  database?.$client.close();
  database = null;

  const TEMP_PATH = path.resolve(await fsp.mkdtemp(path.resolve(os.tmpdir(), './wsh-')), './database.sqlite');
  await fsp.copyFile(SQLITE_PATH, TEMP_PATH);

  database = drizzle({
    client: createClient({
      syncInterval: 1000,
      url: `file:${TEMP_PATH}`,
    }),
    logger: debug ? true : undefined,
    schema,
  });
}
