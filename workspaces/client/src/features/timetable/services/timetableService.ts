/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createFetch } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/openapi/schema';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  throw: true,
});

interface TimetableService {
  fetchTimetable: (
    params: StandardSchemaV1.InferOutput<typeof schema.getTimetableRequestQuery>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const timetableService: TimetableService = {
  async fetchTimetable({ since, until }) {
    const data = (await $fetch('/timetable', {
      query: { since, until },
    })) as StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>;
    return data;
  },
};
