import '@wsh-2025/server/src/setups/luxon';

import cors from '@fastify/cors';
import fastify from 'fastify';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

// アプリケーション内メモリキャッシュ
type CacheEntry = { expireAt: number; payload: string };
const cache = new Map<string, CacheEntry>();

async function main() {
  await initializeDatabase();

  const app = fastify();

  // グローバルキャッシュフック（GETリクエスト、静的ファイル除外）
  app.addHook('preHandler', async (req, reply) => {
    if (
      req.method === 'GET' &&
      !req.url.startsWith('/public') &&
      !req.url.startsWith('/favicon.ico')
    ) {
      const key = `cache:${req.url}`;
      const entry = cache.get(key);
      if (entry && entry.expireAt > Date.now()) {
        // キャッシュが存在する場合はパースして返す
        reply.send(JSON.parse(entry.payload));
      } else {
        cache.delete(key);
      }
    }
  });

  // レスポンス送信時にキャッシュへ保存（TTLはエンドポイント毎に調整）
  app.addHook('onSend', async (req, _reply, payload) => {
    if (
      req.method === 'GET' &&
      !req.url.startsWith('/public') &&
      !req.url.startsWith('/favicon.ico')
    ) {
      const key = `cache:${req.url}`;
      let ttl = 60; // デフォルトは60秒
      if (req.url.startsWith('/streams/episode/')) {
        ttl = 5; // 動的プレイリストは短めのTTL
      }
      if (req.url.startsWith('/streams/channel/')) {
        ttl = 5;
      }
      cache.set(key, { expireAt: Date.now() + ttl * 1000, payload: JSON.stringify(payload) });
    }
    return payload;
  });

  app.register(cors, {
    origin: true,
  });
  app.register(registerApi, { prefix: '/api' });
  app.register(registerStreams);
  app.register(registerSsr);

  await app.ready();
  const address = await app.listen({
    host: '0.0.0.0',
    port: Number(process.env['PORT']),
  });
  console.log(`Server listening at ${address}`);
}

void main();
