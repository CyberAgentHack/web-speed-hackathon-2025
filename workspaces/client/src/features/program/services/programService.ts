import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

import { fetchApiJson } from '@wsh-2025/client/src/features/requests/fetchApi';

const batcher = batshit.create({
  async fetcher(queries: { programId: string }[]) {
    const data = await fetchApiJson(
      `/programs?${new URLSearchParams({ programIds: queries.map((q) => q.programId).join(',') })}`,
    );
    return data as StandardSchemaV1.InferOutput<typeof schema.getProgramsResponse>;
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
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getProgramByIdResponse>>;
  fetchPrograms: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getProgramsResponse>>;
}

export const programService: ProgramService = {
  fetchProgramById: async ({ programId }) => await batcher.fetch({ programId }),
  fetchPrograms: async () => await fetchApiJson('/programs'),
};
