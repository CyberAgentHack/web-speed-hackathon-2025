import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import type { ArrayValues } from 'type-fest';

import { CarouselSection } from '@wsh-2025/client/src/features/recommended/components/CarouselSection';
import { JumbotronSection } from '@wsh-2025/client/src/features/recommended/components/JumbotronSection';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const RecommendedSection = ({ module }: Props) => {
  if (module.type === 'jumbotron') {
    return <JumbotronSection module={module} />;
  }
  return <CarouselSection module={module} />;
};
