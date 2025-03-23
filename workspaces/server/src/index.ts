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
    // キャッシュ可能なパスのリスト
    const cachablePaths = [
      '/api/channels',
      '/api/episodes',
      '/api/series',
      '/api/programs'
    ];
    
    // POSTリクエストや書き込み操作の場合はキャッシュしない
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      reply.header('cache-control', 'no-store');
      return;
    }
    
    // 指定されたパスへのGETリクエストはキャッシュする
    if (req.method === 'GET' && cachablePaths.some(path => req.url.startsWith(path))) {
      reply.header('cache-control', 'public, max-age=60'); // 60秒間のキャッシュ
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
