import '@wsh-2025/server/src/setups/luxon';

import cors from '@fastify/cors';
import fastify from 'fastify';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

async function main() {
  console.log('main 1', performance.now());
  await initializeDatabase();
  console.log('main 2', performance.now());
  const app = fastify();
  console.log('main 3', performance.now());

  app.addHook('onSend', async (_req, reply) => {
    console.log('main 4', performance.now());
    reply.header('cache-control', 'public, max-age=86400, s-maxage=86400');
  });
  app.register(cors, {
    origin: true,
  });
  console.log('main 5', performance.now());
  app.register(registerApi, { prefix: '/api' });
  app.register(registerStreams);
  app.register(registerSsr);

  console.log('main 6', performance.now());
  await app.ready();
  console.log('main 7', performance.now());
  const address = await app.listen({ host: '0.0.0.0', port: Number(process.env['PORT']) });
  console.log(`Server listening at ${address}`);
}

void main();
