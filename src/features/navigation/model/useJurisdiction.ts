import { useMutation } from '@tanstack/react-query';
import { jurisdictionApi } from '../api/jurisdiction';
import { useResultsStore } from './resultsStore';
import { useNavigationStore } from './store';
import type {
  JurisdictionConflictsRequest,
  JurisdictionConflictsResponse,
  JurisdictionConflict,
} from '@/types/jurisdiction';
import type { JurisdictionCode } from '@/types/common';

/**
 * Generate demo conflicts based on selected jurisdictions
 * Used when backend is unavailable
 */
function generateDemoConflicts(
  jurisdictions: JurisdictionCode[],
  instrumentType: string,
  activity: string
): JurisdictionConflictsResponse {
  const conflicts: JurisdictionConflict[] = [];

  // EU + US conflict: Different classification approaches
  if (jurisdictions.includes('EU') && jurisdictions.includes('US')) {
    conflicts.push({
      id: 'conflict-eu-us-classification',
      type: 'classification',
      severity: 'warning',
      jurisdictions: ['EU', 'US'],
      description: 'EU MiCA and US SEC may classify this instrument differently. MiCA treats as e-money token while SEC may consider it a security.',
      rule_ids: ['mica-art-3', 'sec-howey'],
      resolution_strategy: 'satisfy_both',
      resolution_note: 'Obtain legal opinions in both jurisdictions',
      resolvable: true,
    });
  }

  // EU + UK conflict: Post-Brexit divergence
  if (jurisdictions.includes('EU') && jurisdictions.includes('UK')) {
    conflicts.push({
      id: 'conflict-eu-uk-passporting',
      type: 'obligation_conflict',
      severity: 'warning',
      jurisdictions: ['EU', 'UK'],
      description: 'EU MiCA authorization no longer passports to UK. Separate FCA authorization required.',
      rule_ids: ['mica-art-59', 'fca-crypto-regime'],
      resolution_strategy: 'satisfy_both',
      resolution_note: 'Apply for authorization in both jurisdictions',
      resolvable: true,
    });
  }

  // US + SG for stablecoins
  if (jurisdictions.includes('US') && jurisdictions.includes('SG') && instrumentType === 'stablecoin') {
    conflicts.push({
      id: 'conflict-us-sg-stablecoin',
      type: 'obligation_conflict',
      severity: 'blocking',
      jurisdictions: ['US', 'SG'],
      description: 'MAS requires 100% reserve backing while US state regulations vary. Reserve composition requirements may conflict.',
      rule_ids: ['mas-ps-act', 'nydfs-stablecoin'],
      resolution_strategy: 'stricter',
      resolution_note: 'Apply strictest reserve requirements across both',
      resolvable: true,
    });
  }

  // CH + EU timeline conflict
  if (jurisdictions.includes('CH') && jurisdictions.includes('EU')) {
    conflicts.push({
      id: 'conflict-ch-eu-timeline',
      type: 'timeline',
      severity: 'info',
      jurisdictions: ['CH', 'EU'],
      description: 'Swiss FINMA authorization timeline (3-6 months) differs from EU MiCA (6-12 months).',
      rule_ids: ['finma-licensing', 'mica-art-63'],
      resolution_strategy: 'earliest',
      resolution_note: 'Plan for longest timeline',
      resolvable: true,
    });
  }

  // Public offer specific conflicts
  if (activity === 'public_offer' && jurisdictions.length >= 2) {
    const hasEU = jurisdictions.includes('EU');
    const hasUS = jurisdictions.includes('US');

    if (hasEU && hasUS) {
      conflicts.push({
        id: 'conflict-prospectus-requirements',
        type: 'obligation',
        severity: 'warning',
        jurisdictions: ['EU', 'US'],
        description: 'EU whitepaper requirements under MiCA differ from SEC registration/exemption disclosure requirements.',
        rule_ids: ['mica-art-6', 'sec-regulation-d'],
        resolution_strategy: 'cumulative',
        resolution_note: 'Prepare comprehensive disclosure satisfying both regimes',
        resolvable: true,
      });
    }
  }

  const blockingCount = conflicts.filter(c => c.severity === 'blocking').length;
  const warningCount = conflicts.filter(c => c.severity === 'warning').length;

  return {
    conflicts,
    blocking_count: blockingCount,
    warning_count: warningCount,
    all_resolvable: conflicts.every(c => c.resolvable),
  };
}

export function useJurisdictionConflicts() {
  const { setJurisdictionConflicts, setCheckingConflicts, setConflictsError } =
    useResultsStore();
  const {
    targetJurisdictions,
    instrumentType,
    activity,
  } = useNavigationStore();

  const mutation = useMutation({
    mutationFn: async (request: JurisdictionConflictsRequest): Promise<JurisdictionConflictsResponse> => {
      try {
        // Try backend first
        return await jurisdictionApi.getConflicts(request);
      } catch (error) {
        // Fall back to demo mode if backend unavailable
        console.warn('Backend unavailable, using demo conflict data');
        return generateDemoConflicts(
          request.jurisdictions,
          request.instrument_type,
          request.activity
        );
      }
    },
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
