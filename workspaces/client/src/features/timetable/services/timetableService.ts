import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  schema: createSchema({
    '/timetable': {
      output: schema.getTimetableResponse,
      query: schema.getTimetableRequestQuery,
    },
  }),
  throw: true,
});

interface TimetableService {
  fetchTimetable: (
    params: StandardSchemaV1.InferOutput<typeof schema.getTimetableRequestQuery>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const timetableService: TimetableService = {
  async fetchTimetable({ since, until }) {
    const data = await $fetch('/timetable', {
      query: { since, until },
    });
    return data;
  },
};
