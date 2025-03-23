import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

import { fetchApiJson } from '@wsh-2025/client/src/features/requests/fetchApi';

interface RecommendedService {
  fetchRecommendedModulesByReferenceId: (params: {
    referenceId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const recommendedService: RecommendedService = {
  fetchRecommendedModulesByReferenceId: async ({ referenceId }) => await fetchApiJson(`/recommended/${referenceId}`),
};
