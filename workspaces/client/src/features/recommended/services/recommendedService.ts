import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  schema: createSchema({
    '/recommended/:referenceId': {
      output: schema.getRecommendedModulesResponse,
    },
    '/recommended/entrance': {
      output: schema.getRecommendedModulesResponse,
    },
  }),
  throw: true,
});

interface RecommendedService {
  fetchRecommendedModulesByReferenceId: (params: {
    referenceId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
  fetchRecommendedModulesForEntrance: () => Promise<
    StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>
  >;
}

export const recommendedService: RecommendedService = {
  async fetchRecommendedModulesByReferenceId({ referenceId }) {
    const data = await $fetch('/recommended/:referenceId', {
      params: { referenceId },
      // TOP以外のページでは1つだけ表示する
      query: {
        limit: 1,
      },
    });
    return data;
  },
  async fetchRecommendedModulesForEntrance() {
    const data = await $fetch('/recommended/entrance', {
      params: { referenceId: 'entrance' },
    });
    return data;
  },
};
