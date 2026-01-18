import { apiClient } from './client';
import type {
  InlineAnalyzeRequest,
  CounterfactualResponse,
  ComparisonMatrix,
  Scenario,
} from '@/types/counterfactual';

export const counterfactualApi = {
  /**
   * Evaluate baseline and analyze counterfactual in one call
   */
  async analyzeInline(request: InlineAnalyzeRequest): Promise<CounterfactualResponse> {
    const response = await apiClient.post<CounterfactualResponse>(
      '/counterfactual/analyze/inline',
      request
    );
    return response.data;
  },

  /**
   * Compare multiple scenarios
   */
  async compareInline(request: {
    instrument_type?: string;
    activity?: string;
    jurisdiction?: string;
    authorized?: boolean;
    actor_type?: string;
    issuer_type?: string;
    extra?: Record<string, unknown>;
    rule_id?: string;
    scenarios: Scenario[];
  }): Promise<ComparisonMatrix> {
    const response = await apiClient.post<ComparisonMatrix>(
      '/counterfactual/compare/inline',
      request
    );
    return response.data;
  },

  /**
   * List available scenario types
   */
  async listScenarioTypes(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      parameters: string[];
    }>
  > {
    const response = await apiClient.get('/counterfactual/scenario-types');
    return response.data;
  },
};
