import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

import { fetchApiJson } from '@wsh-2025/client/src/features/requests/fetchApi';

interface TimetableService {
  fetchTimetable: (
    params: StandardSchemaV1.InferOutput<typeof schema.getTimetableRequestQuery>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const timetableService: TimetableService = {
  fetchTimetable: async ({ since, until }) => await fetchApiJson(`/timetable?${new URLSearchParams({ since, until })}`),
};
