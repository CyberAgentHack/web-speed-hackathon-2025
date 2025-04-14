import { en, Faker, ja } from '@faker-js/faker';
import { createClient } from '@libsql/client';
import * as schema from '@wsh-2025/schema/src/database/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { reset } from 'drizzle-seed';
import { DateTime } from 'luxon';

import { fetchAnimeList } from '@wsh-2025/server/tools/fetch_anime_list';
import { fetchLoremIpsumWordList } from '@wsh-2025/server/tools/fetch_lorem_ipsum_word_list';
import * as bcrypt from 'bcrypt';
import path from 'node:path';
import { readdirSync } from 'node:fs';

function getFiles(parent: string): string[] {
  const dirents = readdirSync(parent, { withFileTypes: true });
  return dirents
    .filter((dirent) => dirent.isFile() && !dirent.name.startsWith('.'))
    .map((dirent) => path.join(parent, dirent.name));
}

interface Channel {
  id: string;
  name: string;
}

const CHANNEL_NAME_LIST: Channel[] = [
  {
    id: 'news',
    name: 'ニュース',
  },
  {
    id: 'anime',
    name: 'アニメ',
  },
  {
    id: 'documentary',
    name: 'ドキュメンタリー',
  },
  {
    id: 'drama',
    name: 'ドラマ',
  },
  {
    id: 'variety',
    name: 'バラエティ',
  },
  {
    id: 'reality',
    name: 'リアリティーショー',
  },
  {
    id: 'fightingsports',
    name: '格闘',
  },
  {
    id: 'music',
    name: '音楽',
  },
  {
    id: 'shogi',
    name: '将棋',
  },
  {
    id: 'mahjong',
    name: '麻雀',
  },
  {
    id: 'sumo',
    name: '大相撲',
  },
  {
    id: 'soccer',
    name: 'サッカー',
  },
];

async function main() {
  const faker = new Faker({
    locale: [{ lorem: { word: await fetchLoremIpsumWordList() } }, ja, en],
  });

  faker.seed(2345678908);

  const database = drizzle({
    client: createClient({
      syncInterval: 1000,
      url: 'file:./database.sqlite',
    }),
  });

  const rootDir = path.resolve(__dirname, '../../..');
  const files = await getFiles(path.resolve(rootDir, 'public/images'));
  const imagePaths = files.map((file) => path.join('/', path.relative(rootDir, file)));

  try {
    const animeList = await fetchAnimeList();
    const seriesTitleList = animeList.series.map((s) => s.title);
    const episodeTitleList = animeList.episode.map((e) => e.title);

    await reset(database, schema);

    // Create streams
    console.log('Creating streams...');
    const streamList = await database
      .insert(schema.stream)
      .values([
        { id: 'caminandes2', numberOfChunks: 73 },
        { id: 'dailydweebs', numberOfChunks: 30 },
        { id: 'glasshalf', numberOfChunks: 96 },
        { id: 'wing-it', numberOfChunks: 117 },
      ])
      .returning();

    // Create channels
    console.log('Creating channels...');
    const channelList: (typeof schema.channel.$inferSelect)[] = [];
    {
      const data: (typeof schema.channel.$inferInsert)[] = CHANNEL_NAME_LIST.map(({ id, name }) => ({
        id: faker.string.uuid(),
        logoUrl: `/public/logos/${id}.svg`,
        name,
      }));
      const result = await database.insert(schema.channel).values(data).returning();
      channelList.push(...result);
    }

    // Create series
    console.log('Creating series...');
    const seriesList: (typeof schema.series.$inferSelect)[] = [];
    {
      const data: (typeof schema.series.$inferInsert)[] = Array.from({ length: 30 }, () => ({
        description: faker.lorem.paragraph({ max: 200, min: 100 }).replace(/\s/g, '').replace(/\./g, '。'),
        id: faker.string.uuid(),
        thumbnailUrl: `${faker.helpers.arrayElement(imagePaths)}`,
        title: faker.helpers.arrayElement(seriesTitleList),
      }));
      const result = await database.insert(schema.series).values(data).returning();
      seriesList.push(...result);
    }

    // Create episodes
    console.log('Creating episodes...');
    const episodeList: (typeof schema.episode.$inferSelect)[] = [];
    for (const series of seriesList) {
      const data: (typeof schema.episode.$inferInsert)[] = Array.from(
        { length: faker.number.int({ max: 20, min: 10 }) },
        (_, idx) => ({
          description: faker.lorem.paragraph({ max: 200, min: 100 }).replace(/\s/g, '').replace(/\./g, '。'),
          id: faker.string.uuid(),
          order: idx + 1,
          seriesId: series.id,
          streamId: faker.helpers.arrayElement(streamList).id,
          thumbnailUrl: `${faker.helpers.arrayElement(imagePaths)}`,
          title: `第${String(idx + 1)}話 ${faker.helpers.arrayElement(episodeTitleList)}`,
          premium: idx % 5 === 0,
        }),
      );
      const result = await database.insert(schema.episode).values(data).returning();
      episodeList.push(...result);
    }

    // Create programs
    console.log('Creating programs...');
    const programList: (typeof schema.program.$inferInsert)[] = [];
    const episodeListGroupedByStreamId = Object.values(Object.groupBy(episodeList, (episode) => episode.streamId));
    for (const channel of channelList) {
      let remainingMinutes = 24 * 60;
      let startAt = DateTime.now().startOf('day').toMillis();

      while (remainingMinutes > 0) {
        const durationCandidate =
          channel.name === 'ニュース' ? 5 : faker.number.int({ max: 120, min: 15, multipleOf: 15 });
        const duration = Math.min(durationCandidate, remainingMinutes);
        const endAt = startAt + duration * 60 * 1000;
        const episode = faker.helpers.arrayElement(
          episodeListGroupedByStreamId[programList.length % streamList.length]!,
        );
        const series = seriesList.find((s) => s.id === episode.seriesId);
        const program: typeof schema.program.$inferInsert = {
          channelId: channel.id,
          description: faker.lorem.paragraph({ max: 200, min: 100 }).replace(/\s/g, '').replace(/\./g, '。'),
          endAt: new Date(endAt).toISOString(),
          episodeId: episode.id,
          id: faker.string.uuid(),
          startAt: new Date(startAt).toISOString(),
          thumbnailUrl: `${faker.helpers.arrayElement(imagePaths)}`,
          title: `${series?.title ?? ''} ${episode.title}`,
        };
        programList.push(program);

        remainingMinutes -= duration;
        startAt = endAt;
      }
    }
    await database.insert(schema.program).values(programList);

    // Create recommended modules
    console.log('Creating recommended modules...');
    for (const reference of [
      ...seriesList.map((s) => ({ id: s.id, type: 'series', series: s }) as const),
      ...episodeList.map((e) => ({ id: e.id, type: 'episode', episode: e }) as const),
      ...programList.map((p) => ({ id: p.id, type: 'program', program: p }) as const),
      { id: 'entrance', type: 'entrance' } as const,
      { id: 'error', type: 'error' } as const,
    ]) {
      const seriesIds = faker.helpers.shuffle(
        seriesList
          .filter((target) => {
            return target.id !== reference.id;
          })
          .map((s) => s.id),
      );

      const episodeIds = faker.helpers.shuffle(
        episodeList
          .filter((target) => {
            switch (reference.type) {
              case 'series': {
                return target.seriesId !== reference.series.id;
              }
              case 'episode': {
                const series = seriesList.find((s) => s.id === reference.episode.seriesId);
                const relatedEpisodes = episodeList.filter((e) => e.seriesId === series?.id);
                return relatedEpisodes.every((r) => r.id !== target.id);
              }
              case 'program': {
                const targetEpisode = episodeList.find((s) => s.id === reference.program.episodeId);
                const series = seriesList.find((s) => s.id === targetEpisode?.seriesId);
                const relatedEpisodes = episodeList.filter((e) => e.seriesId === series?.id);
                return relatedEpisodes.every((r) => r.id !== target.id);
              }
              default: {
                return true;
              }
            }
          })
          .map((e) => e.id),
      );

      const moduleList = await database
        .insert(schema.recommendedModule)
        .values(
          Array.from({ length: 20 }, (_, moduleOrder) => {
            const moduleType = reference.id === 'entrance' && moduleOrder % 4 === 0 ? 'jumbotron' : 'carousel';

            return {
              id: faker.string.uuid(),
              order: moduleOrder + 1,
              referenceId: reference.id,
              title:
                moduleType === 'jumbotron'
                  ? ''
                  : `『${faker.helpers.arrayElement(seriesTitleList)}』を見ているあなたにオススメ`,
              type: moduleType,
            };
          }),
        )
        .returning();

      for (const module of moduleList) {
        if (module.type === 'jumbotron') {
          await database.insert(schema.recommendedItem).values([
            {
              episodeId: episodeIds.shift()!,
              id: faker.string.uuid(),
              moduleId: module.id,
              order: 1,
              seriesId: null,
            },
          ]);
        } else if (module.order === 2) {
          await database.insert(schema.recommendedItem).values(
            Array.from({ length: faker.number.int({ max: 20, min: 15 }) }, (_, itemOrder) => ({
              episodeId: null,
              id: faker.string.uuid(),
              moduleId: module.id,
              order: itemOrder + 1,
              seriesId: seriesIds.shift()!,
            })),
          );
        } else {
          await database.insert(schema.recommendedItem).values(
            Array.from({ length: faker.number.int({ max: 20, min: 15 }) }, (_, itemOrder) => ({
              episodeId: episodeIds.shift()!,
              id: faker.string.uuid(),
              moduleId: module.id,
              order: itemOrder + 1,
              seriesId: null,
            })),
          );
        }
      }
    }

    // Create test users
    console.log('Creating test users...');
    await database.insert(schema.user).values([
      {
        email: 'test@example.com',
        password: bcrypt.hashSync('test', 10),
      },
    ]);
  } finally {
    database.$client.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
});
