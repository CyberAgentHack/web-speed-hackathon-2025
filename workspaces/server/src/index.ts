import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCompress from '@fastify/compress';
import path from 'path';

const app = Fastify({ logger: true });
app.register(fastifyCompress);
app.register(fastifyStatic, {
  root: path.join(__dirname, '../../client/dist'),
  prefix: '/',
  maxAge: '365d',
  immutable: true
});

app.get('/api/hello', async () => {
  return { message: 'Hello World' };
});

app.listen({ port: 8000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});
