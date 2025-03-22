import '@wsh-2025/server/src/setups/luxon';

import path from 'node:path';

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

  // 1 回目の fastifyStatic 登録（画像用）
  app.register(fastifyStatic, {
    root: path.resolve(__dirname, '../public/images'),
    prefix: '/images/',
    maxAge: '30d',
  });

  // 2 回目の fastifyStatic 登録（ロゴ用）
  app.register(fastifyStatic, {
    root: path.resolve(__dirname, '../public/logos'),
    prefix: '/logos/',
    maxAge: '30d',
    decorateReply: false, // デコレーターの再登録を防ぐ
  });

  // その他 → no-store
  app.addHook('onSend', async (req, reply, payload) => {
    if (!req.url.startsWith('/images/') && !req.url.startsWith('/logos/')) {
      reply.header('cache-control', 'no-store');
    }
    return payload;
  });

  app.register(cors, { origin: true });
  app.register(registerApi, { prefix: '/api' });
  app.register(registerStreams);
  app.register(registerSsr);

  await app.ready();
  const address = await app.listen({ host: '0.0.0.0', port: Number(process.env['PORT']) });
  console.log(`Server listening at ${address}`);
}

void main();
