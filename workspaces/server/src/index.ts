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

  app.addHook('onSend', async (_req, reply) => {
    // reply.header('cache-control', 'no-store');
    reply.header('cache-control', 'public');
  });
  //add --------------------------
  import compress from '@fastify/compress'; // 追加：圧縮プラグインの読み込み
  app.register(compress, {
    // デフォルトで最適な圧縮が有効になります
    global: true,
  });
  //-------------------------------
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
