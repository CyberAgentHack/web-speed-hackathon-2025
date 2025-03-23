import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getTimetableRequestQuery, getTimetableResponse } from '@wsh-2025/schema/src/openapi/schema';

const $fetch = createFetch({
  baseURL: import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:8000/api',
  schema: createSchema({
    '/timetable': {
      output: getTimetableResponse,
      query: getTimetableRequestQuery,
    },
  }),
  throw: true,
});

interface TimetableService {
  fetchTimetable: (
    params: StandardSchemaV1.InferOutput<typeof getTimetableRequestQuery>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof getTimetableResponse>>;
}

export const timetableService: TimetableService = {
  async fetchTimetable({ since, until }) {
    const data = await $fetch('/timetable', {
      query: { since, until },
    });
    return data;
  },
};
