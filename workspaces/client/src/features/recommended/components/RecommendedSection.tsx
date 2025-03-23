import { StandardSchemaV1 } from '@standard-schema/spec';
import { getRecommendedModulesResponse } from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

import { CarouselSection } from '@wsh-2025/client/src/features/recommended/components/CarouselSection';
import { JumbotronSection } from '@wsh-2025/client/src/features/recommended/components/JumbotronSection';


interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof getRecommendedModulesResponse>>;
}

export const RecommendedSection = ({ module }: Props) => {
  if (module.type === 'jumbotron') {
    return <JumbotronSection module={module} />;
  } else {
    return <CarouselSection module={module} />;
  }
};
