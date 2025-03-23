import '@wsh-2025/server/src/setups/luxon';

import cors from '@fastify/cors';
import fastify from 'fastify';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

async function main() {
  await initializeDatabase();

  const app = fastify({
    logger: process.env['NODE_ENV'] === 'development' ? true : false,
  });

  app.addHook('onSend', async (req, reply) => {
    // APIリクエストは一時間キャッシュ
    if (req.url.startsWith('/api')) {
      // ミューテーションメソッドや認証関連はキャッシュしない
      if (req.method !== 'GET' || req.url.includes('/signIn')) {
        reply.header('cache-control', 'no-store');
      } else {
        reply.header('cache-control', 'public, max-age=3600');
      }
    }
    // 静的ファイルは長期間キャッシュ
    else if (req.url.startsWith('/public/')) {
      reply.header('cache-control', 'public, max-age=86400, immutable');
    }
    // ストリームはキャッシュ
    else if (req.url.startsWith('/streams/')) {
      reply.header('cache-control', 'public, max-age=3600');
    }
    // その他のリクエストはキャッシュしない
    else {
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
