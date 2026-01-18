import { apiClient } from './client';
import type { InlineDecisionRequest, DecoderResponse } from '@/types/decoder';

export const decoderApi = {
  /**
   * Evaluate a scenario and generate explanation in one call
   */
  async explainInline(request: InlineDecisionRequest): Promise<DecoderResponse> {
    const response = await apiClient.post<DecoderResponse>('/decoder/explain/inline', request);
    return response.data;
  },

  /**
   * List available explanation tiers
   */
  async listTiers(): Promise<
    Array<{ id: string; name: string; description: string }>
  > {
    const response = await apiClient.get('/decoder/tiers');
    return response.data;
  },

  /**
   * List available templates
   */
  async listTemplates(): Promise<
    Array<{
      id: string;
      name: string;
      version: string;
      frameworks: string[];
      activity_types: string[];
      outcome: string;
    }>
  > {
    const response = await apiClient.get('/decoder/templates');
    return response.data;
  },
};
