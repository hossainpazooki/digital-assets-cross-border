import { apiClient } from '@shared/api';
import type { NavigateRequest, NavigateResponse } from '@/types/navigate';

export const navigateApi = {
  /**
   * Navigate cross-border compliance requirements
   */
  async navigate(request: NavigateRequest): Promise<NavigateResponse> {
    const response = await apiClient.post<NavigateResponse>('/navigate', request);
    return response.data;
  },

  /**
   * List all supported jurisdictions
   */
  async listJurisdictions(): Promise<{
    jurisdictions: Array<{ code: string; name: string; authority: string }>;
  }> {
    const response = await apiClient.get('/navigate/jurisdictions');
    return response.data;
  },

  /**
   * List all regulatory regimes
   */
  async listRegimes(): Promise<{
    regimes: Array<{
      id: string;
      jurisdiction_code: string;
      name: string;
      effective_date: string;
    }>;
  }> {
    const response = await apiClient.get('/navigate/regimes');
    return response.data;
  },

  /**
   * List equivalence determinations
   */
  async listEquivalences(): Promise<{
    equivalences: Array<{
      id: string;
      from_jurisdiction: string;
      to_jurisdiction: string;
      scope: string;
      status: string;
    }>;
  }> {
    const response = await apiClient.get('/navigate/equivalences');
    return response.data;
  },
};
