import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';

import fastifyStatic from '@fastify/static';
import dedent from 'dedent';
import type { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';

import { getDatabase } from '@wsh-2025/server/src/drizzle/database';

const SEQUENCE_DURATION_MS = 2 * 1000;
const SEQUENCE_COUNT_PER_PLAYLIST = 10;
const THUMBNAILS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../thumbnails');

// サムネイルディレクトリを作成
if (!existsSync(THUMBNAILS_DIR)) {
  mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

// 競技のため、時刻のみを返す
function getTime(d: Date): number {
  return d.getTime() - DateTime.fromJSDate(d).startOf('day').toMillis();
}

// FFmpegを使用してサムネイル画像を生成する関数
async function generateThumbnail(streamId: string, outputPath: string): Promise<boolean> {
  try {
    // サムネイルが既に存在する場合は再生成しない
    if (existsSync(outputPath)) {
      return true;
    }

    const streamsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../streams');
    const segmentFiles = [];

    // 最初の数セグメントだけ使用
    const segmentCount = 10;
    for (let i = 0; i < segmentCount; i++) {
      const segmentPath = path.join(streamsDir, streamId, `${String(i).padStart(3, '0')}.ts`);
      if (existsSync(segmentPath)) {
        segmentFiles.push(segmentPath);
      }
    }

    if (segmentFiles.length === 0) {
      return false;
    }

    // FFmpegを使用してサムネイル生成
    const segmentList = segmentFiles.join('|');
    execSync(
      `ffmpeg -i "concat:${segmentList}" -vf "fps=30,select='not(mod(n\\,30))',scale=160:90,tile=250x1" -frames:v 1 "${outputPath}"`,
      { stdio: 'ignore' },
    );

    return existsSync(outputPath);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return false;
  }
}

export function registerStreams(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    prefix: '/streams/',
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../streams'),
  });

  // サムネイル用のスタティックファイル提供
  app.register(fastifyStatic, {
    prefix: '/thumbnails/',
    root: THUMBNAILS_DIR,
    decorateReply: false,
  });

  // 新しいサムネイルエンドポイントを追加
  app.get<{
    Params: { episodeId: string };
  }>('/streams/episode/:episodeId/thumbnails', async (req, reply) => {
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
      return reply.status(404).send({ error: 'Episode not found' });
    }

    const stream = episode.stream;
    const thumbnailPath = path.join(THUMBNAILS_DIR, `${stream.id}.jpg`);

    // サムネイルを生成して提供
    const success = await generateThumbnail(stream.id, thumbnailPath);

    if (!success) {
      return reply.status(500).send({ error: 'Failed to generate thumbnail' });
    }

    return reply.sendFile(`${stream.id}.jpg`);
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

    const playlist = [
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
            eq(program.channelId, req.params.channelId),
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

      playlist.push(
        dedent`
          ${chunkIdx === 0 ? '#EXT-X-DISCONTINUITY' : ''}
          #EXTINF:2.000000,
          /streams/${stream.id}/${String(chunkIdx).padStart(3, '0')}.ts
          #EXT-X-DATERANGE:${[
            `ID="arema-${sequence}"`,
            `START-DATE="${sequenceStartAt.toISOString()}"`,
            `DURATION=2.0`,
            `X-AREMA-INTERNAL="${randomBytes(3 * 1024 * 1024).toString('base64')}"`,
          ].join(',')}
        `,
      );
    }

    reply.type('application/vnd.apple.mpegurl').send(playlist.join('\n'));
  });
}
