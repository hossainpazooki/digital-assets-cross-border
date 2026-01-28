import { useMutation } from '@tanstack/react-query';
import { navigateApi } from '@/api';
import { useResultsStore } from '@/stores';
import { useNavigationStore } from '@/stores';
import type { NavigateRequest, NavigateResponse, JurisdictionResult, PathwayStep, RuleConflict } from '@/types/navigate';
import type { JurisdictionCode } from '@/types/common';

/**
 * Generate demo navigation response when backend is unavailable
 */
function generateDemoNavigateResponse(request: NavigateRequest): NavigateResponse {
  const jurisdictionResults: JurisdictionResult[] = [];
  const pathway: PathwayStep[] = [];
  const conflicts: RuleConflict[] = [];

  // Generate results for each target jurisdiction
  request.target_jurisdictions.forEach((jurisdiction, index) => {
    const isStablecoin = request.instrument_type === 'stablecoin';
    const isPublicOffer = request.activity === 'public_offer';

    // Determine status based on jurisdiction and instrument type
    let status: 'compliant' | 'blocked' | 'requires_action' | 'no_applicable_rules' = 'requires_action';
    const obligations = [];

    if (jurisdiction === 'EU') {
      status = 'requires_action';
      obligations.push({
        id: `obl-${jurisdiction}-1`,
        description: isStablecoin
          ? 'Obtain MiCA e-money token authorization from NCA'
          : 'Submit crypto-asset whitepaper to NCA',
        deadline: '90 days before launch',
        rule_id: 'mica-art-48',
        jurisdiction: jurisdiction as JurisdictionCode,
      });
      if (isPublicOffer) {
        obligations.push({
          id: `obl-${jurisdiction}-2`,
          description: 'Publish approved whitepaper 20 days before offering',
          rule_id: 'mica-art-6',
          jurisdiction: jurisdiction as JurisdictionCode,
        });
      }
    } else if (jurisdiction === 'UK') {
      status = 'requires_action';
      obligations.push({
        id: `obl-${jurisdiction}-1`,
        description: 'Register with FCA under cryptoasset regime',
        deadline: '6 months',
        rule_id: 'fca-crypto-2024',
        jurisdiction: jurisdiction as JurisdictionCode,
      });
    } else if (jurisdiction === 'US') {
      status = isStablecoin ? 'requires_action' : 'blocked';
      obligations.push({
        id: `obl-${jurisdiction}-1`,
        description: isStablecoin
          ? 'Obtain state money transmitter licenses'
          : 'Determine if instrument is a security under Howey test',
        rule_id: 'sec-howey',
        jurisdiction: jurisdiction as JurisdictionCode,
      });
    } else if (jurisdiction === 'CH') {
      status = 'requires_action';
      obligations.push({
        id: `obl-${jurisdiction}-1`,
        description: 'Obtain FINMA no-action letter or license',
        deadline: '3-6 months',
        rule_id: 'finma-dlt-2021',
        jurisdiction: jurisdiction as JurisdictionCode,
      });
    } else if (jurisdiction === 'SG') {
      status = 'requires_action';
      obligations.push({
        id: `obl-${jurisdiction}-1`,
        description: 'Register under Payment Services Act with MAS',
        deadline: '6 months',
        rule_id: 'mas-psa-2019',
        jurisdiction: jurisdiction as JurisdictionCode,
      });
    }

    jurisdictionResults.push({
      jurisdiction: jurisdiction as JurisdictionCode,
      regime_id: `${jurisdiction.toLowerCase()}-regime`,
      role: index === 0 ? 'target' : 'target',
      status,
      applicable_rules: 5,
      rules_evaluated: 5,
      decisions: [
        {
          rule_id: `${jurisdiction.toLowerCase()}-classification`,
          decision: `Instrument classified under ${jurisdiction} framework`,
          trace: [
            {
              path: 'instrument_type',
              condition: `instrument.type == "${request.instrument_type}"`,
              result: true,
            },
          ],
        },
      ],
      obligations,
    });

    // Add pathway steps
    pathway.push({
      step_id: `step-${jurisdiction}-1`,
      jurisdiction: jurisdiction as JurisdictionCode,
      regime_id: `${jurisdiction.toLowerCase()}-regime`,
      obligation_id: `obl-${jurisdiction}-1`,
      action: obligations[0]?.description || 'Complete regulatory filing',
      source: {
        document_id: `${jurisdiction.toLowerCase()}-regulation`,
        article: 'Article 1',
      },
      prerequisites: index > 0 ? [`step-${request.target_jurisdictions[index - 1]}-1`] : [],
      timeline: { min_days: 30, max_days: 90 },
      status: 'pending',
    });
  });

  // Add conflicts for multi-jurisdiction scenarios
  if (request.target_jurisdictions.includes('EU') && request.target_jurisdictions.includes('US')) {
    conflicts.push({
      id: 'conflict-eu-us',
      type: 'classification',
      severity: 'warning',
      jurisdictions: ['EU', 'US'],
      description: 'Classification approaches differ between MiCA and SEC frameworks',
      resolution_strategy: 'satisfy_both',
      resolution_note: 'Obtain legal opinions in both jurisdictions',
    });
  }

  if (request.target_jurisdictions.includes('EU') && request.target_jurisdictions.includes('UK')) {
    conflicts.push({
      id: 'conflict-eu-uk',
      type: 'obligation_conflict',
      severity: 'warning',
      jurisdictions: ['EU', 'UK'],
      description: 'Separate authorizations required post-Brexit',
      resolution_strategy: 'satisfy_both',
    });
  }

  // Determine overall status
  const anyBlocked = jurisdictionResults.some(r => r.status === 'blocked');
  const allCompliant = jurisdictionResults.every(r => r.status === 'compliant');

  return {
    status: anyBlocked ? 'blocked' : allCompliant ? 'actionable' : 'requires_review',
    applicable_jurisdictions: request.target_jurisdictions.map((j, i) => ({
      jurisdiction: j as JurisdictionCode,
      regime_id: `${j.toLowerCase()}-regime`,
      role: i === 0 ? 'target' as const : 'target' as const,
    })),
    jurisdiction_results: jurisdictionResults,
    conflicts,
    pathway,
    cumulative_obligations: [],
    estimated_timeline: `${pathway.length * 30}-${pathway.length * 90} days`,
    audit_trail: [
      {
        timestamp: new Date().toISOString(),
        action: 'navigate',
        details: { mode: 'demo', jurisdictions: request.target_jurisdictions },
      },
    ],
  };
}

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
    mutationFn: async (request: NavigateRequest): Promise<NavigateResponse> => {
      try {
        // Try backend first
        return await navigateApi.navigate(request);
      } catch (error) {
        // Fall back to demo mode if backend unavailable
        console.warn('Backend unavailable, using demo navigation data');
        return generateDemoNavigateResponse(request);
      }
    },
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
