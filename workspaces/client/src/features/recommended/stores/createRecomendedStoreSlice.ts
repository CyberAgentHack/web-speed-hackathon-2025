import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

import { recommendedService } from '@wsh-2025/client/src/features/recommended/services/recommendedService';

type ReferenceId = string;
type RecommendedModuleId = string;

interface RecommendedState {
  recommendedModules: Record<
    RecommendedModuleId,
    ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>
  >;
  references: Record<ReferenceId, RecommendedModuleId[]>;
}

interface RecommendedActions {
  fetchRecommendedModulesByReferenceId: (params: {
    referenceId: ReferenceId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const createRecommendedStoreSlice = () => {
  return lens<RecommendedState & RecommendedActions>((set, get) => ({
    fetchRecommendedModulesByReferenceId: async ({ referenceId }) => {
      const state = get();
      if (state.references[referenceId]) {
        const moduleIds = state.references[referenceId];
        const cachedModules = moduleIds.map((id) => state.recommendedModules[id]!);
        return cachedModules;
      }

      const modules = await recommendedService.fetchRecommendedModulesByReferenceId({ referenceId });

      set((state) => {
        const newReferences = { ...state.references };
        const newRecommendedModules = { ...state.recommendedModules };

        newReferences[referenceId] = modules.map((module) => module.id);
        for (const module of modules) {
          newRecommendedModules[module.id] = module;
        }

        return {
          ...state,
          recommendedModules: newRecommendedModules,
          references: newReferences,
        };
      });

      return modules;
    },
    recommendedModules: {},
    references: {},
  }));
};
