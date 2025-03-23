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

  // 画像のみキャッシュする
  app.addHook('onSend', async (_req, reply) => {
    const contentType = reply.getHeader('Content-Type');
    if (reply.statusCode === 200 && typeof contentType === 'string' && contentType.startsWith('image/')) {
      reply.header('Cache-Control', 'public, max-age=31536000');
    } else {
      reply.header('Cache-Control', 'no-store');
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
