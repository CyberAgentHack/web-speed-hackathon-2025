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
    const recommendedModuleList = await database.select().from(schema.recommendedModule);

    for (const recommendedModule of recommendedModuleList) {
      const editedTitle = recommendedModule.title.slice(1).split('』を見ているあなたにオススメ')[0];
      console.log(editedTitle);
      if (editedTitle === undefined) {
        console.error('Failed to trim the title of the recommendedModule.');
        break;
      }
      await database
        .update(schema.recommendedModule)
        .set({ title: editedTitle })
        .where(eq(schema.recommendedModule.id, recommendedModule.id));
    }
    console.log(recommendedModuleList.length);

    console.log('recommendedModule descriptions have been trimmed to 300 characters.');
  } finally {
    database.$client.close();
  }
}

trimDescription().catch((error: unknown) => {
  console.error(error);
});
