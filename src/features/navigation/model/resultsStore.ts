import { create } from 'zustand';
import type { NavigateResponse } from '@/types/navigate';
import type { DecoderResponse } from '@/types/decoder';
import type { CounterfactualResponse } from '@/types/counterfactual';
import type { JurisdictionConflictsResponse } from '@/types/jurisdiction';

interface ResultsState {
  // Navigation results
  navigationResult: NavigateResponse | null;
  isNavigating: boolean;
  navigationError: string | null;

  // Decoder results
  decoderResult: DecoderResponse | null;
  isDecoding: boolean;
  decoderError: string | null;

  // Counterfactual results
  counterfactualResults: CounterfactualResponse[];
  isAnalyzing: boolean;
  counterfactualError: string | null;

  // Jurisdiction conflicts (preview)
  jurisdictionConflicts: JurisdictionConflictsResponse | null;
  isCheckingConflicts: boolean;
  conflictsError: string | null;

  // Computed
  analysisComplete: boolean;

  // Actions
  setNavigationResult: (result: NavigateResponse) => void;
  setNavigating: (loading: boolean) => void;
  setNavigationError: (error: string | null) => void;
  setDecoderResult: (result: DecoderResponse) => void;
  setDecoding: (loading: boolean) => void;
  setDecoderError: (error: string | null) => void;
  addCounterfactualResult: (result: CounterfactualResponse) => void;
  setAnalyzing: (loading: boolean) => void;
  setCounterfactualError: (error: string | null) => void;
  setJurisdictionConflicts: (result: JurisdictionConflictsResponse) => void;
  setCheckingConflicts: (loading: boolean) => void;
  setConflictsError: (error: string | null) => void;
  clearResults: () => void;
}

export const useResultsStore = create<ResultsState>((set) => ({
  navigationResult: null,
  isNavigating: false,
  navigationError: null,
  decoderResult: null,
  isDecoding: false,
  decoderError: null,
  counterfactualResults: [],
  isAnalyzing: false,
  counterfactualError: null,
  jurisdictionConflicts: null,
  isCheckingConflicts: false,
  conflictsError: null,
  analysisComplete: false,

  setNavigationResult: (result) =>
    set({
      navigationResult: result,
      analysisComplete: true,
      isNavigating: false,
      navigationError: null,
    }),

  setNavigating: (loading) => set({ isNavigating: loading }),

  setNavigationError: (error) =>
    set({ navigationError: error, isNavigating: false }),

  setDecoderResult: (result) =>
    set({
      decoderResult: result,
      isDecoding: false,
      decoderError: null,
    }),

  setDecoding: (loading) => set({ isDecoding: loading }),

  setDecoderError: (error) => set({ decoderError: error, isDecoding: false }),

  addCounterfactualResult: (result) =>
    set((state) => ({
      counterfactualResults: [...state.counterfactualResults, result],
      isAnalyzing: false,
    })),

  setAnalyzing: (loading) => set({ isAnalyzing: loading }),

  setCounterfactualError: (error) =>
    set({ counterfactualError: error, isAnalyzing: false }),

  setJurisdictionConflicts: (result) =>
    set({
      jurisdictionConflicts: result,
      isCheckingConflicts: false,
      conflictsError: null,
    }),

  setCheckingConflicts: (loading) => set({ isCheckingConflicts: loading }),

  setConflictsError: (error) =>
    set({ conflictsError: error, isCheckingConflicts: false }),

  clearResults: () =>
    set({
      navigationResult: null,
      decoderResult: null,
      counterfactualResults: [],
      jurisdictionConflicts: null,
      analysisComplete: false,
      navigationError: null,
      decoderError: null,
      counterfactualError: null,
      conflictsError: null,
    }),
}));
