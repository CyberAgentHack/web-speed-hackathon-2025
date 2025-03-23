import '@wsh-2025/server/src/setups/luxon';

import cors from '@fastify/cors';
import fastify from 'fastify';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';

async function main() {
  await initializeDatabase();

  const app = fastify({
    http2: true,
    https: {
      key: readFileSync(resolve(__dirname, '../ssl/key.pem')),
      cert: readFileSync(resolve(__dirname, '../ssl/cert.pem'))
    }
  });

  app.addHook('onSend', async (_req, reply) => {
    reply.header('cache-control', 'no-store');
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
    port: Number(process.env['PORT'])
  });
  console.log(`Server listening at ${address}`);
}

void main();
