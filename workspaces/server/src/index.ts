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

  const now = new Date();
  console.log('Registering plugins', now);
  app.addHook('onSend', async (req, reply) => {
    const url = req.url;
    
    // Cache static resources like images, JS, CSS, SVG, video streams
    if (
      url.match(/\.(jpg|jpeg|png|gif|svg|webp|js|css|woff|woff2|ttf|eot|ts|m3u8)$/i) ||
      url.startsWith('/public/') ||
      url.startsWith('/images/') ||
      url.startsWith('/animations/') ||
      url.startsWith('/logos/') ||
      url.startsWith('/streams/')
    ) {
      // Cache for 1 week (604800 seconds)
      reply.header('cache-control', 'public, max-age=604800, immutable');
    } else {
      // Don't cache dynamic content
      reply.header('cache-control', 'no-store');
    }
  });
  console.log('Registered onSend hook', new Date().getTime() - now.getTime());
  app.register(cors, {
    origin: true,
  });
  console.log('Registered CORS plugin', new Date().getTime() - now.getTime());
  app.register(registerApi, { prefix: '/api' });
  console.log('Registered API plugin', new Date().getTime() - now.getTime());
  app.register(registerStreams);
  console.log('Registered streams plugin', new Date().getTime() - now.getTime());
  app.register(registerSsr);

  console.log('ready', new Date().getTime() - now.getTime());
  await app.ready();
  console.log('after ready', new Date().getTime() - now.getTime());
  const address = await app.listen({ host: '0.0.0.0', port: Number(process.env['PORT']) });
  console.log(`Server listening at ${address}`);
}

void main();
