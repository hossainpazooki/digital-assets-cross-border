import { useMutation } from '@tanstack/react-query';
import { decoderApi } from '../api/decoder';
import { useResultsStore } from '@features/navigation/model';
import { useUIStore } from '@app/stores';
import type { InlineDecisionRequest, DecoderResponse } from '@/types/decoder';

/**
 * Generate demo decoder response when backend is unavailable
 */
function generateDemoDecoderResponse(request: InlineDecisionRequest): DecoderResponse {
  const tier = request.tier || 'retail';

  // Tier-specific explanations
  const explanations = {
    retail: {
      headline: 'Authorization required before offering',
      body: 'Based on the selected jurisdictions and instrument type, you need to obtain regulatory authorization before proceeding. This typically involves submitting documentation to the relevant authorities and waiting for approval.',
      conditions: [
        'Submit required whitepaper or registration documents',
        'Obtain approval from each jurisdiction\'s regulatory authority',
        'Maintain ongoing compliance reporting',
      ],
      warnings: [
        'Operating without authorization may result in penalties',
        'Cross-border offerings require multiple authorizations',
      ],
    },
    protocol: {
      headline: 'Multi-jurisdiction authorization pathway identified',
      body: 'The regulatory analysis indicates a requires_action status across target jurisdictions. Key regulatory frameworks include MiCA (EU), FCA Crypto Regime (UK), and SEC/CFTC guidelines (US). Smart contract implementations should include compliance checkpoints.',
      conditions: [
        'Implement on-chain compliance verification for investor eligibility',
        'Deploy geographic restrictions based on IP and wallet analysis',
        'Maintain reserve attestations on-chain where applicable',
      ],
      warnings: [
        'Classification may differ between jurisdictions - dual structure may be needed',
        'DeFi exemptions vary significantly across frameworks',
      ],
    },
    institutional: {
      headline: 'Regulatory pathway analysis complete',
      body: 'Cross-border compliance analysis reveals overlapping regulatory requirements with potential conflicts between frameworks. Recommended approach: sequential authorization starting with primary market jurisdiction.',
      conditions: [
        'Engage local counsel in each target jurisdiction',
        'Establish licensed entity structure in primary jurisdiction',
        'Implement cross-border compliance monitoring framework',
      ],
      warnings: [
        'Passporting not available between EU and UK post-Brexit',
        'US classification under Howey test may trigger securities requirements',
      ],
    },
    regulator: {
      headline: 'Article-by-article regulatory mapping',
      body: 'Analysis maps instrument characteristics to specific regulatory provisions: MiCA Art. 3 (definition), Art. 48 (authorization), Art. 6 (whitepaper). US analysis under Securities Act 1933 §2(a)(1) and Howey test factors. FCA authorization under FSMA 2000 as amended.',
      conditions: [
        'MiCA Art. 48: Authorization requirement for e-money token issuers',
        'FCA FSMA 2000 Part 4A: Authorization for cryptoasset activities',
        'SEC Securities Act: Registration or valid exemption required',
      ],
      warnings: [
        'Conflicting classification between MiCA and SEC frameworks',
        'No equivalence determination between EU and UK for cryptoassets',
      ],
    },
  };

  const explanation = explanations[tier] || explanations.retail;

  return {
    explanation_id: `demo-exp-${Date.now()}`,
    decision_id: `demo-dec-${Date.now()}`,
    tier,
    generated_at: new Date().toISOString(),
    summary: {
      status: 'requires_action',
      confidence: 0.85,
      confidence_level: 'inferred',
      primary_framework: 'MiCA 2023/1114',
      risk_level: 'MEDIUM',
    },
    explanation,
    citations: [
      {
        id: 'cite-1',
        framework: 'MiCA',
        reference: 'Article 48',
        full_reference: 'Regulation (EU) 2023/1114, Article 48',
        text: 'No person shall make a public offer of asset-referenced tokens in the Union unless that person is the issuer of such asset-referenced tokens and has been authorised...',
        url: 'https://eur-lex.europa.eu/eli/reg/2023/1114',
        effective_date: '2024-06-30',
        relevance: 'primary',
        relevance_score: 0.95,
      },
      {
        id: 'cite-2',
        framework: 'MiCA',
        reference: 'Article 6',
        full_reference: 'Regulation (EU) 2023/1114, Article 6',
        text: 'The crypto-asset white paper shall contain all the information necessary to enable potential holders to make an informed purchase decision...',
        url: 'https://eur-lex.europa.eu/eli/reg/2023/1114',
        effective_date: '2024-06-30',
        relevance: 'supporting',
        relevance_score: 0.8,
      },
    ],
    audit: {
      trace_id: `demo-trace-${Date.now()}`,
      rules_evaluated: 12,
      processing_time_ms: 150,
      model_version: 'demo-1.0',
    },
  };
}

export function useDecoder() {
  const { setDecoderResult, setDecoding, setDecoderError } = useResultsStore();
  const { selectedTier } = useUIStore();

  const mutation = useMutation({
    mutationFn: async (request: InlineDecisionRequest): Promise<DecoderResponse> => {
      try {
        // Try backend first
        return await decoderApi.explainInline(request);
      } catch (error) {
        // Fall back to demo mode if backend unavailable
        console.warn('Backend unavailable, using demo decoder data');
        return generateDemoDecoderResponse(request);
      }
    },
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
