import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';
import { getRecommendedModulesResponse } from '@wsh-2025/schema/src/api/schema';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  schema: createSchema({
    '/recommended/:referenceId': {
      output: getRecommendedModulesResponse,
    },
  }),
  throw: true,
});

interface RecommendedService {
  fetchRecommendedModulesByReferenceId: (params: {
    referenceId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getRecommendedModulesResponse>>;
}

export const recommendedService: RecommendedService = {
  async fetchRecommendedModulesByReferenceId({ referenceId }) {
    const data = await $fetch('/recommended/:referenceId', {
      params: { referenceId },
    });
    return data;
  },
};
