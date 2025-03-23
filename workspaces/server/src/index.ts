import '@wsh-2025/server/src/setups/luxon';

import cors from '@fastify/cors';
import fastify from 'fastify';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

// 共通状態の初期化関数（新しく追加）
async function main() {
  // データベースの初期化
  await initializeDatabase();

  const app = fastify({
    // パフォーマンス最適化のための設定
    disableRequestLogging: true,
    logger: false,
  });

  // // レスポンス圧縮を追加（パフォーマンス向上）
  // app.register(compress, {
  //   encodings: ['gzip', 'deflate', 'br'],
  // });

  app.addHook('onSend', async (_req, reply) => {
    // 静的アセットにはキャッシュヘッダーを設定
    if (_req.url.startsWith('/public/')) {
      reply.header('cache-control', 'public, max-age=31536000, immutable');
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

  // サーバーのパフォーマンス最適化
  app.server.keepAliveTimeout = 5000;
  app.server.headersTimeout = 6000;

  return app;
}

void main();
