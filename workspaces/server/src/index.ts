import "@wsh-2025/server/src/setups/luxon";

import fs from "node:fs";

import cors from "@fastify/cors";
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
  app.get("/ffmpeg-core.js", (_req, reply) => {
    const stream = fs.createReadStream(
      "../../node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js",
      "utf8",
    );
    reply.header("Content-Type", "application/octet-stream");
    reply.send(stream);
  });
  app.get("/ffmpeg-core.wasm", (_req, reply) => {
    const stream = fs.createReadStream(
      "../../node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.wasm",
      "utf8",
    );
    reply.header("Content-Type", "application/octet-stream");
    reply.send(stream);
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
