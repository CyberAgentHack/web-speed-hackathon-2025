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
    const seriesList = await database.select().from(schema.series);

    for (const series of seriesList) {
      console.log(series.description);
      const trimmedDescription = series.description.slice(0, 300);
      await database
        .update(schema.series)
        .set({ description: trimmedDescription })
        .where(eq(schema.series.id, series.id));
    }
    console.log(seriesList.length);

    console.log('series descriptions have been trimmed to 300 characters.');
  } finally {
    database.$client.close();
  }
}

trimDescription().catch((error: unknown) => {
  console.error(error);
});
