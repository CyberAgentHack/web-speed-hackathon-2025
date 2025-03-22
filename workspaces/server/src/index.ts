import '@wsh-2025/server/src/setups/luxon';

import path from 'path';

import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

async function main() {
  await initializeDatabase();

  const app = fastify();

  // 静的ファイル配信の設定 - png.cjsで指定した/static/パスに対応
  await app.register(fastifyStatic, {
    root: path.join(__dirname, '../..'),
    prefix: '/static/',
    decorateReply: false,
  });

  app.addHook('onSend', async (_req, reply) => {
    // サムネイルはキャッシュを許可
    if (_req.url.startsWith('/thumbnails/')) {
      reply.header('cache-control', 'max-age=86400');
    } else {
      reply.header('cache-control', 'no-store');
    }
  });

  app.register(cors, {
    origin: true,
  });

  app.register(registerApi, { prefix: '/api' });
  app.register(registerStreams);
  app.register(registerSsr);

  await app.ready();
  const address = await app.listen({ host: '0.0.0.0', port: Number(process.env['PORT']) });
  console.log(`Server listening at ${address}`);
}

void main();
