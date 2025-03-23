import { createFetch, createSchema } from "@better-fetch/fetch";
import { StandardSchemaV1 } from "@standard-schema/spec";
import * as schema from "@wsh-2025/schema/src/api/schema";

import { schedulePlugin } from "@wsh-2025/client/src/features/requests/schedulePlugin";

const $fetch = createFetch({
  baseURL: process.env["API_BASE_URL"] ?? "/api",
  plugins: [schedulePlugin],
  schema: createSchema({
    "/episodes": {
      output: schema.getEpisodesResponse,
      query: schema.getEpisodesRequestQuery,
    },
    "/episodes/:episodeId": {
      output: schema.getEpisodeByIdResponse,
    },
  }),
  throw: true,
});

interface EpisodeService {
  fetchEpisodeById: (query: {
    episodeId: string;
  }) => Promise<
    StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>
  >;
  fetchEpisodes: () => Promise<
    StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>
  >;
}

export const episodeService: EpisodeService = {
  async fetchEpisodeById({ episodeId }) {
    const episode = await $fetch("/episodes/:episodeId", {
      params: { episodeId },
    });
    return episode;
  },
  async fetchEpisodes() {
    const data = await $fetch("/episodes", { query: {} });
    return data;
  },
};
