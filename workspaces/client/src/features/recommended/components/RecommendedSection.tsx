import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { lazy, Suspense } from 'react';
import { ArrayValues } from 'type-fest';
const CarouselSection = lazy(() =>
  import('@wsh-2025/client/src/features/recommended/components/CarouselSection').then((module) => ({
    default: module.CarouselSection,
  })),
);

const JumbotronSection = lazy(() =>
  import('@wsh-2025/client/src/features/recommended/components/JumbotronSection').then((module) => ({
    default: module.JumbotronSection,
  })),
);
interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const RecommendedSection = ({ module }: Props) => {
  if (module.type === 'jumbotron') {
    return (
      <Suspense>
        <JumbotronSection module={module} />
      </Suspense>
    );
  } else {
    return (
      <Suspense>
        <CarouselSection module={module} />
      </Suspense>
    );
  }
};
