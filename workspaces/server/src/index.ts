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
    // パスベースのキャッシュポリシー
    const path = req.url;
    
    // 1. 動画ストリーミングファイル（長時間キャッシュ）
    if (path.includes('.m3u8') || path.includes('.ts') || path.startsWith('/streams/')) {
      reply.header('cache-control', 'public, max-age=86400, stale-while-revalidate=172800');
    }
    // 2. 静的アセット（長時間キャッシュ）
    else if (path.includes('/public/') || path.match(/\.(jpg|jpeg|png|webp|svg|css|js|ico)(\?|$)/)) {
      reply.header('cache-control', 'public, max-age=86400, immutable');
    }
    // 3. エピソードや番組メタデータ（短時間キャッシュ）
    else if (path.match(/\/api\/episodes\/|\/api\/programs\//)) {
      reply.header('cache-control', 'public, max-age=3600, stale-while-revalidate=7200');
    }
    // 4. サムネイル画像（中程度のキャッシュ）
    else if (path.includes('/preview.jpg') || path.includes('/thumbnail')) {
      reply.header('cache-control', 'public, max-age=43200'); // 12時間
    }
    // 5. ユーザー固有のデータやセッション（キャッシュなし）
    else if (path.includes('/api/user/') || path.includes('/api/auth/')) {
      reply.header('cache-control', 'no-store');
    }
    // 6. その他のAPI（短時間キャッシュ）
    else if (path.startsWith('/api/')) {
      if (req.method === 'GET') {
        reply.header('cache-control', 'public, max-age=60, stale-while-revalidate=300');
      } else {
        reply.header('cache-control', 'no-store');
      }
    }
    // 7. その他すべて（デフォルト）
    else {
      reply.header('cache-control', 'no-cache');
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
