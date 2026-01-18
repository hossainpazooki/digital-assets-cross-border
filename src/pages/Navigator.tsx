import { NavigationForm } from '@/components/forms';
import { ResultsSummary } from '@/components/results';
import { useResultsStore } from '@/stores';

export function Navigator() {
  const { analysisComplete } = useResultsStore();

  return (
    <div className="space-y-6">
      <NavigationForm />
      {analysisComplete && <ResultsSummary />}
    </div>
  );
}
