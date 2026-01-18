import { useMutation } from '@tanstack/react-query';
import { counterfactualApi } from '@/api';
import { useResultsStore, useUIStore } from '@/stores';
import type { InlineAnalyzeRequest, Scenario } from '@/types/counterfactual';

export function useCounterfactual() {
  const { addCounterfactualResult, setAnalyzing, setCounterfactualError } =
    useResultsStore();
  const { selectedTier } = useUIStore();

  const mutation = useMutation({
    mutationFn: (request: InlineAnalyzeRequest) =>
      counterfactualApi.analyzeInline(request),
    onMutate: () => {
      setAnalyzing(true);
      setCounterfactualError(null);
    },
    onSuccess: (data) => {
      addCounterfactualResult(data);
    },
    onError: (error: Error) => {
      setCounterfactualError(error.message);
    },
  });

  const analyze = (scenario: Scenario, params?: Partial<InlineAnalyzeRequest>) => {
    const request: InlineAnalyzeRequest = {
      scenario,
      include_explanation: true,
      explanation_tier: selectedTier,
      ...params,
    };
    mutation.mutate(request);
  };

  return {
    analyze,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
