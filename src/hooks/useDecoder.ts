import { useMutation } from '@tanstack/react-query';
import { decoderApi } from '@/api';
import { useResultsStore, useUIStore } from '@/stores';
import type { InlineDecisionRequest } from '@/types/decoder';

export function useDecoder() {
  const { setDecoderResult, setDecoding, setDecoderError } = useResultsStore();
  const { selectedTier } = useUIStore();

  const mutation = useMutation({
    mutationFn: (request: InlineDecisionRequest) =>
      decoderApi.explainInline(request),
    onMutate: () => {
      setDecoding(true);
      setDecoderError(null);
    },
    onSuccess: (data) => {
      setDecoderResult(data);
    },
    onError: (error: Error) => {
      setDecoderError(error.message);
    },
  });

  const explain = (params: Partial<InlineDecisionRequest>) => {
    const request: InlineDecisionRequest = {
      tier: selectedTier,
      include_citations: true,
      ...params,
    };
    mutation.mutate(request);
  };

  return {
    explain,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
