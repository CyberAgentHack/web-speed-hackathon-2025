import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

export function registerSsr(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    prefix: '/',
    root: [path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist')],
  });

  app.get('/favicon.ico', (_, reply) => {
    reply.status(404).send();
  });
}
