import { StandardSchemaV1 } from '@standard-schema/spec';
import { getRecommendedModulesResponse } from '@wsh-2025/schema/src/api/schema';
import React from 'react';
import { ArrayValues } from 'type-fest';

import { MemoCarouselSection } from '@wsh-2025/client/src/features/recommended/components/CarouselSection';
import { MemoJumbotronSection } from '@wsh-2025/client/src/features/recommended/components/JumbotronSection';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof getRecommendedModulesResponse>>;
}

export const RecommendedSection = ({ module }: Props) => {
  if (module.type === 'jumbotron') {
    return <MemoJumbotronSection module={module} />;
  } else {
    return <MemoCarouselSection module={module} />;
  }
};

export const MemoRecommendedSection = React.memo(RecommendedSection);
