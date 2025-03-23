import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import dedent from 'dedent';
import type { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';

import { getDatabase, executeWithCache } from '@wsh-2025/server/src/drizzle/database';

const SEQUENCE_DURATION_MS = 2 * 1000;
const SEQUENCE_COUNT_PER_PLAYLIST = 10;

// 競技のため、時刻のみを返す
function getTime(d: Date): number {
  return d.getTime() - DateTime.fromJSDate(d).startOf('day').toMillis();
}

export function registerStreams(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    prefix: '/streams/',
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../streams'),
  });

  app.get<{
    Params: { episodeId: string };
  }>('/streams/episode/:episodeId/playlist.m3u8', async (req, reply) => {
    const database = getDatabase();
    const episodeId = req.params.episodeId;

    // エピソードプレイリストのキャッシュキー
    const cacheKey = `episode_playlist_${episodeId}`;

    // プレイリストのキャッシング（10分間のTTL）
    const playlist = await executeWithCache(cacheKey, async () => {
      const episode = await database.query.episode.findFirst({
        where(episode, { eq }) {
          return eq(episode.id, episodeId);
        },
        with: {
          stream: true,
        },
      });

      if (episode == null) {
        throw new Error('The episode is not found.');
      }

      const stream = episode.stream;

      return dedent`
        #EXTM3U
        #EXT-X-TARGETDURATION:3
        #EXT-X-VERSION:3
        #EXT-X-MEDIA-SEQUENCE:1
        ${Array.from({ length: stream.numberOfChunks }, (_, idx) => {
          return dedent`
            #EXTINF:2.000000,
            /streams/${stream.id}/${String(idx).padStart(3, '0')}.ts
          `;
        }).join('\n')}
        #EXT-X-ENDLIST
      `;
    }, 10 * 60 * 1000); // 10分間のキャッシュ

    reply.type('application/vnd.apple.mpegurl').send(playlist);
  });

  app.get<{
    Params: { channelId: string };
  }>('/streams/channel/:channelId/playlist.m3u8', async (req, reply) => {
    const database = getDatabase();
    const channelId = req.params.channelId;

    // チャンネルプレイリストはリアルタイム性が高いためキャッシングは短時間に
    const currentTimestamp = Date.now();
    // 現在の分数を含めてキャッシュキーを作成（1分ごとに更新）
    const minute = new Date(currentTimestamp).getMinutes();
    const cacheKey = `channel_playlist_${channelId}_${minute}`;

    const playlist = await executeWithCache(cacheKey, async () => {
      const firstSequence = Math.floor(currentTimestamp / SEQUENCE_DURATION_MS) - SEQUENCE_COUNT_PER_PLAYLIST;
      const playlistStartAt = new Date(firstSequence * SEQUENCE_DURATION_MS);

      const result = [
        dedent`
          #EXTM3U
          #EXT-X-TARGETDURATION:3
          #EXT-X-VERSION:3
          #EXT-X-MEDIA-SEQUENCE:${firstSequence}
          #EXT-X-PROGRAM-DATE-TIME:${playlistStartAt.toISOString()}
        `,
      ];

      for (let idx = 0; idx < SEQUENCE_COUNT_PER_PLAYLIST; idx++) {
        const sequence = firstSequence + idx;
        const sequenceStartAt = new Date(sequence * SEQUENCE_DURATION_MS);

        const program = await database.query.program.findFirst({
          orderBy(program, { asc }) {
            return asc(program.startAt);
          },
          where(program, { and, eq, lt, lte, sql }) {
            // 競技のため、時刻のみで比較する
            return and(
              lte(program.startAt, sql`time(${sequenceStartAt.toISOString()}, '+9 hours')`),
              lt(sql`time(${sequenceStartAt.toISOString()}, '+9 hours')`, program.endAt),
              eq(program.channelId, channelId),
            );
          },
          with: {
            episode: {
              with: {
                stream: true,
              },
            },
          },
        });

        if (program == null) {
          break;
        }

        const stream = program.episode.stream;
        const sequenceInStream = Math.floor(
          (getTime(sequenceStartAt) - getTime(new Date(program.startAt))) / SEQUENCE_DURATION_MS,
        );
        const chunkIdx = sequenceInStream % stream.numberOfChunks;

        result.push(
          dedent`
            ${chunkIdx === 0 ? '#EXT-X-DISCONTINUITY' : ''}
            #EXTINF:2.000000,
            /streams/${stream.id}/${String(chunkIdx).padStart(3, '0')}.ts
            #EXT-X-DATERANGE:${[
              `ID="arema-${sequence}"`,
              `START-DATE="${sequenceStartAt.toISOString()}"`,
              `DURATION=2.0`,
              `X-AREMA-INTERNAL="${randomBytes(16).toString('hex')}"`,
            ].join(',')}
          `,
        );
      }

      return result.join('\n');
    }, 30 * 1000); // 30秒間のキャッシュ

    reply.type('application/vnd.apple.mpegurl').send(playlist);
  });
}
