import '@wsh-2025/server/src/setups/luxon';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyCompress from '@fastify/compress'
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';

import { registerApi } from '@wsh-2025/server/src/api';
import { initializeDatabase } from '@wsh-2025/server/src/drizzle/database';
import { registerSsr } from '@wsh-2025/server/src/ssr';
import { registerStreams } from '@wsh-2025/server/src/streams';


async function main() {
  await initializeDatabase();

  const app = fastify();

  app.register(cors, {
    origin: true,
  });
  app.register(registerApi, {
    cacheControl: 'no-store',
    prefix: '/api',
  });
  app.register(registerStreams, {
    cacheControl: 'no-store',
  });
  app.register(registerSsr, {
    cacheControl: 'no-store',
  });

  app.register(fastifyCompress, { encodings: ['gzip', 'deflate'] });

  app.register(fastifyStatic, {
    cacheControl: true,
    prefix: '/public/',
    root: [
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
    ],
  });

  app.get('/favicon.ico', (_, reply) => {
    reply.status(404).send();
  });

  await app.ready();
  const address = await app.listen({ host: '0.0.0.0', port: Number(process.env['PORT']) });
  console.log(`Server listening at ${address}`);
}

void main();
