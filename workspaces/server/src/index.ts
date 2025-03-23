import '@wsh-2025/server/src/setups/luxon';

import cors from '@fastify/cors';
import fastify from 'fastify';
import fs from 'fs'

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

async function main() {
  await initializeDatabase();

  const app = fastify();
  // const app = fastify({
  //   http2: true,
  //   https: {
  //     key: fs.readFileSync('./key.pem'), // SSL証明書のキー
  //     cert: fs.readFileSync('./cert.pem'), // SSL証明書
  //   },
  // });

  app.addHook('onSend', async (_req, reply) => {
    // reply.header('cache-control', 'no-store');
    reply.header('cache-control', 'public, max-age=3600');
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
