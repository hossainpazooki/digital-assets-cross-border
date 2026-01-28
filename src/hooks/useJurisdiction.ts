import { useMutation } from '@tanstack/react-query';
import { jurisdictionApi } from '@/api';
import { useResultsStore, useNavigationStore } from '@/stores';
import type { JurisdictionConflictsRequest } from '@/types/jurisdiction';

export function useJurisdictionConflicts() {
  const { setJurisdictionConflicts, setCheckingConflicts, setConflictsError } =
    useResultsStore();
  const {
    targetJurisdictions,
    instrumentType,
    activity,
  } = useNavigationStore();

  const mutation = useMutation({
    mutationFn: (request: JurisdictionConflictsRequest) =>
      jurisdictionApi.getConflicts(request),
    onMutate: () => {
      setCheckingConflicts(true);
      setConflictsError(null);
    },
    onSuccess: (data) => {
      setJurisdictionConflicts(data);
    },
    onError: (error: Error) => {
      setConflictsError(error.message);
    },
  });

  const checkConflicts = (params?: Partial<JurisdictionConflictsRequest>) => {
    const request: JurisdictionConflictsRequest = {
      jurisdictions: targetJurisdictions,
      instrument_type: instrumentType,
      activity: activity,
      include_resolved: true,
      ...params,
    };
    mutation.mutate(request);
  };

  return {
    checkConflicts,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
