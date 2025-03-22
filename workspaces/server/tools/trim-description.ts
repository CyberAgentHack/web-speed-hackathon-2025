import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { eq } from 'drizzle-orm';

async function trimDescription() {
  const database = drizzle({
    client: createClient({
      syncInterval: 1000,
      url: 'file:./database.sqlite',
    }),
  });

  try {
    const episodeList = await database.select().from(schema.episode);

    for (const episode of episodeList) {
      const editedUrl = episode.thumbnailUrl.split('jpeg')[0] + 'avif';
      console.log(editedUrl);
      await database.update(schema.episode).set({ thumbnailUrl: editedUrl }).where(eq(schema.episode.id, episode.id));
    }
    console.log(episodeList.length);

    console.log('episode descriptions have been trimmed to 300 characters.');
  } finally {
    database.$client.close();
  }
}

trimDescription().catch((error: unknown) => {
  console.error(error);
});
