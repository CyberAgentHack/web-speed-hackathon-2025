import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

import { CarouselSection } from '@wsh-2025/client/src/features/recommended/components/CarouselSection';
import { JumbotronSection } from '@wsh-2025/client/src/features/recommended/components/JumbotronSection';

interface Props {
  lazy?: boolean
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const RecommendedSection = ({ lazy = false, module }: Props) => {
  if (module.type === 'jumbotron') {
    return <JumbotronSection module={module} />;
  } else {
    return <CarouselSection lazy={lazy} module={module} />;
  }
};
