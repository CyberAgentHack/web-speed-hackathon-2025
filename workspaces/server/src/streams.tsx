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

// プレイリストを生成する共通関数
async function generateEpisodePlaylist(_: FastifyInstance, episodeId: string, isPreview: boolean) {
  const database = getDatabase();

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
  const streamPath = isPreview ? 'preview-streams' : 'streams';

  const playlist = dedent`
    #EXTM3U
    #EXT-X-TARGETDURATION:3
    #EXT-X-VERSION:3
    #EXT-X-MEDIA-SEQUENCE:1
    ${Array.from({ length: stream.numberOfChunks }, (_, idx) => {
      return dedent`
        #EXTINF:2.000000,
        /${streamPath}/${stream.id}/${String(idx).padStart(3, '0')}.ts
      `;
    }).join('\n')}
    #EXT-X-ENDLIST
  `;

  return playlist;
}

// チャンネルプレイリストを生成する共通関数
async function generateChannelPlaylist(_: FastifyInstance, channelId: string, isPreview: boolean) {
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
    const streamPath = isPreview ? 'preview-streams' : 'streams';

    playlist.push(
      dedent`
        ${chunkIdx === 0 ? '#EXT-X-DISCONTINUITY' : ''}
        #EXTINF:2.000000,
        /${streamPath}/${stream.id}/${String(chunkIdx).padStart(3, '0')}.ts
        #EXT-X-DATERANGE:${[
          `ID="arema-${sequence}"`,
          `START-DATE="${sequenceStartAt.toISOString()}"`,
          `DURATION=2.0`,
        ].join(',')}
      `,
    );
  }

  return playlist.join('\n');
}

export function registerStreams(app: FastifyInstance): void {
  // 高画質と低画質のストリームを登録
  app.register(async function (fastify) {
    await fastify.register(fastifyStatic, {
      root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../streams'),
      prefix: '/streams/',
      decorateReply: false
    });

    await fastify.register(fastifyStatic, {
      root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../preview_streams'),
      prefix: '/preview-streams/',
      decorateReply: false
    });
  });

  // オリジナルのエピソードプレイリスト
  app.get<{
    Params: { episodeId: string };
  }>('/streams/episode/:episodeId/playlist.m3u8', async (req, reply) => {
    const playlist = await generateEpisodePlaylist(app, req.params.episodeId, false);
    reply.type('application/vnd.apple.mpegurl').send(playlist);
  });

  // プレビュー用のエピソードプレイリスト
  app.get<{
    Params: { episodeId: string };
  }>('/preview-streams/episode/:episodeId/playlist.m3u8', async (req, reply) => {
    const playlist = await generateEpisodePlaylist(app, req.params.episodeId, true);
    reply.type('application/vnd.apple.mpegurl').send(playlist);
  });

  // オリジナルのチャンネルプレイリスト
  app.get<{
    Params: { channelId: string };
  }>('/streams/channel/:channelId/playlist.m3u8', async (req, reply) => {
    const playlist = await generateChannelPlaylist(app, req.params.channelId, false);
    reply.type('application/vnd.apple.mpegurl').send(playlist);
  });

  // プレビュー用のチャンネルプレイリスト
  app.get<{
    Params: { channelId: string };
  }>('/preview-streams/channel/:channelId/playlist.m3u8', async (req, reply) => {
    const playlist = await generateChannelPlaylist(app, req.params.channelId, true);
    reply.type('application/vnd.apple.mpegurl').send(playlist);
  });
}
