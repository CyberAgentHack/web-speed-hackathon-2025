import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import {
  getProgramsResponse,
  getProgramsRequestQuery,
  getProgramByIdResponse,
  getProgramByIdRequestParams,
} from '@wsh-2025/schema/src/openapi/schema';

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

interface ProgramService {
  fetchProgramById: (query: {
    programId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getProgramByIdResponse>>;
  fetchPrograms: () => Promise<StandardSchemaV1.InferOutput<typeof getProgramsResponse>>;
}

export const programService: ProgramService = {
  async fetchProgramById({ programId }) {
    const channel = await $fetch('/programs', { query: { programIds: programId } });
    if (!channel[0]) {
      throw new Error('Program is not found.');
    }
    return channel[0];
  },
  async fetchPrograms() {
    const data = await $fetch('/programs', { query: {} });
    return data;
  },
};
