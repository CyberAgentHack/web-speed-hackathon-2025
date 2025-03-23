import "@wsh-2025/server/src/setups/luxon";

import path from "node:path";
import { fileURLToPath } from "node:url";

import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastify from "fastify";

import { registerApi } from "@wsh-2025/server/src/api";
import { initializeDatabase } from "@wsh-2025/server/src/drizzle/database";
import { registerSsr } from "@wsh-2025/server/src/ssr";
import { registerStreams } from "@wsh-2025/server/src/streams";

async function main() {
  await initializeDatabase();

  const app = fastify();

  app.addHook("onSend", async (_req, reply) => {
    reply.header("cache-control", "no-store");
  });
  app.register(cors, {
    origin: true,
  });
  app.register(fastifyStatic, {
    decorateReply: false,
    prefix: "/ffmpeg/",
    root: path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../../node_modules/@ffmpeg/core/dist/umd",
    ),
  });
  app.register(registerApi, { prefix: "/api" });
  app.register(registerStreams);
  app.register(registerSsr);

  await app.ready();
  const address = await app.listen({
    host: "0.0.0.0",
    port: Number(process.env["PORT"]),
  });
  console.log(`Server listening at ${address}`);
}

void main();
