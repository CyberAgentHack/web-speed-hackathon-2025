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
        thumbnailUrl: faker.helpers.arrayElement(imagePaths),
        title: faker.helpers.arrayElement(seriesTitleList),
      }));
      const result = await database.insert(schema.series).values(data).returning();
      seriesList.push(...result);
    }

    // Create episodes
    console.log('Creating episodes...');
    const allEpisodes: (typeof schema.episode.$inferInsert)[] = [];
    for (const series of seriesList) {
      const episodes = Array.from(
        { length: faker.number.int({ max: 20, min: 10 }) },
        (_, idx) => ({
          description: faker.lorem.paragraph({ max: 200, min: 100 }).replace(/\s/g, '').replace(/\./g, '。'),
          id: faker.string.uuid(),
          order: idx + 1,
          seriesId: series.id,
          streamId: faker.helpers.arrayElement(streamList).id,
          thumbnailUrl: faker.helpers.arrayElement(imagePaths),
          title: `第${String(idx + 1)}話 ${faker.helpers.arrayElement(episodeTitleList)}`,
          premium: idx % 5 === 0,
        }),
      );
      allEpisodes.push(...episodes);
    }
    const episodeList = await database.insert(schema.episode).values(allEpisodes).returning();

    // Create programs
    console.log('Creating programs...');
    const programList: (typeof schema.program.$inferInsert)[] = [];
    const episodeListGroupedByStreamId = Object.values(Object.groupBy(episodeList, (episode) => episode.streamId));
    for (const channel of channelList) {
      let remainingMinutes = 60;
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
          thumbnailUrl: `${faker.helpers.arrayElement(imagePaths)}?version=${faker.string.nanoid()}`,
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
    // すべてのモジュールを一括で作成するための配列
    const allModules: (typeof schema.recommendedModule.$inferInsert)[] = [];
    // すべてのアイテムを一括で作成するための配列
    const allItems: (typeof schema.recommendedItem.$inferInsert)[] = [];

    for (const reference of [
      ...seriesList.map((s) => ({ id: s.id, type: 'series', series: s }) as const),
      ...episodeList.map((e) => ({ id: e.id, type: 'episode', episode: e }) as const),
      ...programList.map((p) => ({ id: p.id, type: 'program', program: p }) as const),
      { id: 'entrance', type: 'entrance' } as const,
      { id: 'error', type: 'error' } as const,
    ]) {
      // シリーズIDの配列を事前に構築
      const seriesIds = seriesList
        .filter((target) => target.id !== reference.id)
        .map((s) => s.id);

      // エピソードIDの配列を事前に構築
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
              // TODO: エラーの場合は、エラーのみを返す
              default: {
                return true;
              }
            }
          })
          .map((e) => e.id),
      );

      // 現在の参照用のモジュールを作成
      const moduleIds: string[] = [];
      for (let moduleOrder = 0; moduleOrder < 20; moduleOrder++) {
        const moduleId = faker.string.uuid();
        moduleIds.push(moduleId);
        const moduleType = reference.id === 'entrance' && moduleOrder % 4 === 0 ? 'jumbotron' : 'carousel';

        allModules.push({
          id: moduleId,
          order: moduleOrder + 1,
          referenceId: reference.id,
          title: moduleType === 'jumbotron'
            ? ''
            : `『${faker.helpers.arrayElement(seriesTitleList)}』を見ているあなたにオススメ`,
          type: moduleType,
        });

        // モジュールに対するアイテムを準備
        if (moduleType === 'jumbotron') {
          allItems.push({
            episodeId: episodeIds.shift()!,
            id: faker.string.uuid(),
            moduleId: moduleId,
            order: 1,
            seriesId: null,
          });
        } else if (moduleOrder === 1) { // 2番目のモジュール
          for (let itemOrder = 0; itemOrder < faker.number.int({ max: 20, min: 15 }); itemOrder++) {
            allItems.push({
              episodeId: null,
              id: faker.string.uuid(),
              moduleId: moduleId,
              order: itemOrder + 1,
              seriesId: seriesIds[itemOrder % seriesIds.length],
            });
          }
        } else {
          for (let itemOrder = 0; itemOrder < faker.number.int({ max: 20, min: 15 }); itemOrder++) {
            const episodeId = episodeIds[itemOrder % episodeIds.length];
            if (episodeId) {
              allItems.push({
                episodeId: episodeId,
                id: faker.string.uuid(),
                moduleId: moduleId,
                order: itemOrder + 1,
                seriesId: null,
              });
            }
          }
        }
      }
    }

    // データベースに一括挿入
    // console.log(`Inserting ${allModules.length} modules...`);
    // await database.insert(schema.recommendedModule).values(allModules);

    console.log(`Inserting ${allItems.length} items...`);
    // 一度にすべて挿入するとメモリ不足や制限に達する可能性があるので、
    // 分割して挿入することも検討
    const BATCH_SIZE = 1000;
    for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
      const batch = allItems.slice(i, i + BATCH_SIZE);
      await database.insert(schema.recommendedItem).values(batch);
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
