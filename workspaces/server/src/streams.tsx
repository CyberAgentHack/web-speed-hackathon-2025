import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import dedent from 'dedent';
import type { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';

import { getDatabase } from '@wsh-2025/server/src/drizzle/database';

const SEQUENCE_DURATION_MS = 2 * 1000;
const SEQUENCE_COUNT_PER_PLAYLIST = 10;

// 競技のため、時刻のみを返す
function getTime(d: Date): number {
  return d.getTime() - DateTime.fromJSDate(d).startOf('day').toMillis();
}

// 短いランダム文字列を生成する関数
const generateRandomId = () => randomBytes(8).toString('base64');

export function registerStreams(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    prefix: '/streams/',
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../streams'),
  });

  app.get<{
    Params: { episodeId: string };
  }>('/streams/episode/:episodeId/playlist.m3u8', async (req, reply) => {
    const database = getDatabase();

    const episode = await database.query.episode.findFirst({
      where(episode, { eq }) {
        return eq(episode.id, req.params.episodeId);
      },
      with: {
        stream: true,
      },
    });

    if (episode == null) {
      throw new Error('The episode is not found.');
    }

    const stream = episode.stream;

    const playlist = dedent`
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

    reply.type('application/vnd.apple.mpegurl').send(playlist);
  });

  app.get<{
    Params: { channelId: string };
  }>('/streams/channel/:channelId/playlist.m3u8', async (req, reply) => {
    const database = getDatabase();

    const firstSequence = Math.floor(Date.now() / SEQUENCE_DURATION_MS) - SEQUENCE_COUNT_PER_PLAYLIST;
    const playlistStartAt = new Date(firstSequence * SEQUENCE_DURATION_MS);

    // チャンネルIDから現在の番組を1回のクエリで取得
    const currentTime = new Date();
    const programs = await database.query.program.findMany({
      orderBy(program, { asc }) {
        return asc(program.startAt);
      },
      where(program, { and, eq, sql }) {
        const currentTimeSQL = sql`time(${currentTime.toISOString()}, '+9 hours')`;
        return and(
          eq(program.channelId, req.params.channelId),
          // 現在時刻を含む番組を取得
          sql`${program.startAt} <= ${currentTimeSQL}`,
          sql`${program.endAt} >= ${currentTimeSQL}`,
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

    if (programs.length === 0) {
      reply.status(404).send({ error: 'No programs found for this channel' });
      return;
    }

    // プレイリストヘッダーを構築
    const playlist = [
      dedent`
        #EXTM3U
        #EXT-X-TARGETDURATION:3
        #EXT-X-VERSION:3
        #EXT-X-MEDIA-SEQUENCE:${firstSequence}
        #EXT-X-PROGRAM-DATE-TIME:${playlistStartAt.toISOString()}
      `,
    ];

    // 現在のプログラムを使用
    const currentProgram = programs[0];
    if (!currentProgram || !currentProgram.episode || !currentProgram.episode.stream) {
      reply.status(500).send({ error: 'Invalid program data' });
      return;
    }

    const stream = currentProgram.episode.stream;

    // プレイリストセグメントを構築
    for (let idx = 0; idx < SEQUENCE_COUNT_PER_PLAYLIST; idx++) {
      const sequence = firstSequence + idx;
      const sequenceStartAt = new Date(sequence * SEQUENCE_DURATION_MS);

      const sequenceInStream = Math.floor(
        (getTime(sequenceStartAt) - getTime(new Date(currentProgram.startAt))) / SEQUENCE_DURATION_MS,
      );
      const chunkIdx = sequenceInStream % stream.numberOfChunks;

      playlist.push(
        dedent`
          ${chunkIdx === 0 ? '#EXT-X-DISCONTINUITY' : ''}
          #EXTINF:2.000000,
          /streams/${stream.id}/${String(chunkIdx).padStart(3, '0')}.ts
          #EXT-X-DATERANGE:${[
            `ID="arema-${sequence}"`,
            `START-DATE="${sequenceStartAt.toISOString()}"`,
            `DURATION=2.0`,
            `X-AREMA-INTERNAL="${generateRandomId()}"`,
          ].join(',')}
        `,
      );
    }

    reply.type('application/vnd.apple.mpegurl').send(playlist.join('\n'));
  });
}
