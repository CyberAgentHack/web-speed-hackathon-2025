import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

const RecommendedSectionPage = () => {
  const modules = useRecommended({ referenceId: 'error' });
  const module = modules.at(0);

  return <section>{module != null ? <RecommendedSection module={module} /> : null}</section>;
};

export default RecommendedSectionPage;
