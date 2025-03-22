import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import {
  getProgramByIdRequestParams,
  getProgramByIdResponse,
  getProgramsRequestQuery,
  getProgramsResponse,
} from '@wsh-2025/schema/src/openapi/schema';
import * as batshit from '@yornaath/batshit';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  schema: createSchema({
    '/programs': {
      output: getProgramsResponse,
      query: getProgramsRequestQuery,
    },
    '/programs/:episodeId': {
      output: getProgramByIdResponse,
      params: getProgramByIdRequestParams,
    },
  }),
  throw: true,
});

const batcher = batshit.create({
  async fetcher(queries: { programId: string }[]) {
    const data = await $fetch('/programs', {
      query: {
        programIds: queries.map((q) => q.programId).join(','),
      },
    });
    return data;
  },
  resolver(items, query: { programId: string }) {
    const item = items.find((item) => item.id === query.programId);
    if (item == null) {
      throw new Error('Program is not found.');
    }
    return item;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 100,
    windowMs: 1000,
  }),
});

interface ProgramService {
  fetchProgramById: (query: {
    programId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getProgramByIdResponse>>;
  fetchPrograms: () => Promise<StandardSchemaV1.InferOutput<typeof getProgramsResponse>>;
}

export const programService: ProgramService = {
  async fetchProgramById({ programId }) {
    const channel = await batcher.fetch({ programId });
    return channel;
  },
  async fetchPrograms() {
    const data = await $fetch('/programs', { query: {} });
    return data;
  },
};
