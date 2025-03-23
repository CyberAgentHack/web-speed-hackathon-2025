import '@wsh-2025/server/src/setups/luxon';

import cors from '@fastify/cors';
import fastify from 'fastify';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

async function main() {
  await initializeDatabase();

  const app = fastify();

  app.addHook('onSend', async (req, reply) => {
    const url = req.raw.url;

    if (url && url.startsWith('/public/')) {
      // 静的ファイルのキャッシュ設定
      reply.header('cache-control', 'public, max-age=31536000, immutable');
    } else {
      // 動的コンテンツのキャッシュ設定
      reply.header('cache-control', 'public, max-age=60, must-revalidate');
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
