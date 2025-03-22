import "@wsh-2025/server/src/setups/luxon";

import cors from "@fastify/cors";
import fastify from "fastify";

import { registerApi } from "@wsh-2025/server/src/api";
import { initializeDatabase } from "@wsh-2025/server/src/drizzle/database";
import { registerSsr } from "@wsh-2025/server/src/ssr";
import { registerStreams } from "@wsh-2025/server/src/streams";

async function main() {
  await initializeDatabase();

  const app = fastify();

  await app.register(import("@fastify/compress"));
  app.addHook("onSend", async (_req, reply) => {
    reply.header("cache-control", "no-store");
  });
  app.register(cors, {
    origin: true,
  });
  app.register(registerApi, { prefix: "/api" });
  app.register(registerStreams);
  app.register(registerSsr);
  app.get("/ffmpeg-core.js", (_req, reply) => {
    reply.sendFile("@ffmpeg/core/dist/umd/ffmpeg-core.js");
  });
  app.get("/ffmpeg-core.wasm", (_req, reply) => {
    reply.sendFile("@ffmpeg/core/dist/umd/ffmpeg-core.wasm");
  });

  await app.ready();
  const address = await app.listen({
    host: "0.0.0.0",
    port: Number(process.env["PORT"]),
  });
  console.log(`Server listening at ${address}`);
}

void main();
