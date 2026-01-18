import { useMutation } from '@tanstack/react-query';
import { navigateApi } from '@/api';
import { useResultsStore } from '@/stores';
import { useNavigationStore } from '@/stores';
import type { NavigateRequest } from '@/types/navigate';

export function useNavigate() {
  const { setNavigationResult, setNavigating, setNavigationError } =
    useResultsStore();
  const {
    issuerJurisdiction,
    targetJurisdictions,
    instrumentType,
    activity,
    investorTypes,
    amount,
  } = useNavigationStore();

  const mutation = useMutation({
    mutationFn: (request: NavigateRequest) => navigateApi.navigate(request),
    onMutate: () => {
      setNavigating(true);
      setNavigationError(null);
    },
    onSuccess: (data) => {
      setNavigationResult(data);
    },
    onError: (error: Error) => {
      setNavigationError(error.message);
    },
  });

  const navigate = () => {
    const request: NavigateRequest = {
      issuer_jurisdiction: issuerJurisdiction,
      target_jurisdictions: targetJurisdictions,
      instrument_type: instrumentType,
      activity,
      investor_types: investorTypes,
      facts: {
        amount_usd: amount,
      },
    };
    mutation.mutate(request);
  };

  return {
    navigate,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
