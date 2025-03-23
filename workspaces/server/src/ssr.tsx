import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

const base = path.dirname(fileURLToPath(import.meta.url));

export function registerSsr(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    preCompressed: true,
    prefix: '/public/',
    root: [path.resolve(base, '../../client/dist'), path.resolve(base, '../../../public')],
  });

  app.register(fastifyStatic, {
    decorateReply: false,
    preCompressed: true,
    prefix: '/assets/',
    root: [path.resolve(base, '../../client/dist/assets')],
  });

  app.get('/favicon.ico', (_, reply) => {
    reply.status(404).send();
  });

  app.get('/*', async (req, reply) => {
    reply.header('Content-Type', 'text/html');
    return reply.sendFile('index.html', path.resolve(base, '../../client/dist'));
  });
}
