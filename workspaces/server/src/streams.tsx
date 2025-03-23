import { randomBytes } from 'node:crypto/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import dedent from 'dedent';
import type { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';

import { getDatabase } from '@wsh-2025/server/src/drizzle/database';

const SEQUENCE_DURATION_MS = 2 * 1000;
const SEQUENCE_COUNT_PER_PLAYLIST = 10;

// 競技のため、時刻のみを返す（1日の開始からの経過ミリ秒）
function getTime(d: Date): number {
  return d.getTime() - DateTime.fromJSDate(d).startOf('day').toMillis();
}

export function registerStreams(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    prefix: '/streams/',
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../streams'),
  });

  // エピソード単体のプレイリスト生成エンドポイント
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

  // チャンネル単位のプレイリスト生成エンドポイント（改善済）
  app.get<{
    Params: { channelId: string };
  }>('/streams/channel/:channelId/playlist.m3u8', async (req, reply) => {
    const database = getDatabase();

    // シーケンス番号の算出
    const firstSequence = Math.floor(Date.now() / SEQUENCE_DURATION_MS) - SEQUENCE_COUNT_PER_PLAYLIST;
    const playlistStartAt = new Date(firstSequence * SEQUENCE_DURATION_MS);
    const lastSequence = firstSequence + SEQUENCE_COUNT_PER_PLAYLIST - 1;
    const lastSequenceStartAt = new Date(lastSequence * SEQUENCE_DURATION_MS);

    // SQLクエリで使用している時刻変換（+9時間）をJavaScript側で再現
    const minAdjustedTime = new Date(playlistStartAt.getTime() + 9 * 3600 * 1000);
    const maxAdjustedTime = new Date(lastSequenceStartAt.getTime() + 9 * 3600 * 1000);

    // チャンネル内で、対象のシーケンス範囲に該当し得るプログラムを一括取得
    const programs = await database.query.program.findMany({
      where(program, { eq, lte, lt, and }) {
        return and(
          eq(program.channelId, req.params.channelId),
          lte(program.startAt, maxAdjustedTime.toISOString()),
          lt(minAdjustedTime.toISOString(), program.endAt)
        );
      },
      orderBy(program, { asc }) {
        return asc(program.startAt);
      },
      with: {
        episode: {
          with: {
            stream: true,
          },
        },
      },
    });

    const playlistLines = [
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
      const adjustedSequenceTime = new Date(sequenceStartAt.getTime() + 9 * 3600 * 1000);

      // バッチで取得したプログラムから、調整済みシーケンス時刻が該当するプログラムを検索
      const matchingProgram = programs.find((program: any) => {
        const progStart = new Date(program.startAt);
        const progEnd = new Date(program.endAt);
        return progStart <= adjustedSequenceTime && adjustedSequenceTime < progEnd;
      });

      if (!matchingProgram) {
        break;
      }

      const stream = matchingProgram.episode.stream;
      const sequenceInStream = Math.floor(
        (getTime(sequenceStartAt) - getTime(new Date(matchingProgram.startAt))) / SEQUENCE_DURATION_MS,
      );
      const chunkIdx = sequenceInStream % stream.numberOfChunks;

      // 非同期で重いランダムデータを生成（3MB）
      const randomData = await randomBytes(3 * 1024 * 1024);

      playlistLines.push(
        dedent`
          ${chunkIdx === 0 ? '#EXT-X-DISCONTINUITY' : ''}
          #EXTINF:2.000000,
          /streams/${stream.id}/${String(chunkIdx).padStart(3, '0')}.ts
          #EXT-X-DATERANGE:${[
            `ID="arema-${sequence}"`,
            `START-DATE="${sequenceStartAt.toISOString()}"`,
            `DURATION=2.0`,
            `X-AREMA-INTERNAL="${randomData.toString('base64')}"`,
          ].join(',')}
        `,
      );
    }

    reply.type('application/vnd.apple.mpegurl').send(playlistLines.join('\n'));
  });
}

