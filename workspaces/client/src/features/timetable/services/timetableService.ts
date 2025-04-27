import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getTimetableResponse, getTimetableRequestQuery} from '@wsh-2025/schema/src/api/schema';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
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
