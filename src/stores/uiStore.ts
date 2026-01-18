import { create } from 'zustand';
import type { ExplanationTier } from '@/types/common';

type ViewTab = 'navigator' | 'pathway' | 'conflicts' | 'whatif' | 'decoder';

interface UIState {
  // Active view
  activeView: ViewTab;

  // Decoder tier
  selectedTier: ExplanationTier;

  // Expanded items
  expandedJurisdictions: string[];
  expandedConflicts: string[];
  expandedSteps: string[];

  // Actions
  setActiveView: (view: ViewTab) => void;
  setSelectedTier: (tier: ExplanationTier) => void;
  toggleJurisdictionExpanded: (id: string) => void;
  toggleConflictExpanded: (id: string) => void;
  toggleStepExpanded: (id: string) => void;
  resetUI: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'navigator',
  selectedTier: 'institutional',
  expandedJurisdictions: [],
  expandedConflicts: [],
  expandedSteps: [],

  setActiveView: (view) => set({ activeView: view }),

  setSelectedTier: (tier) => set({ selectedTier: tier }),

  toggleJurisdictionExpanded: (id) =>
    set((state) => ({
      expandedJurisdictions: state.expandedJurisdictions.includes(id)
        ? state.expandedJurisdictions.filter((i) => i !== id)
        : [...state.expandedJurisdictions, id],
    })),

  toggleConflictExpanded: (id) =>
    set((state) => ({
      expandedConflicts: state.expandedConflicts.includes(id)
        ? state.expandedConflicts.filter((i) => i !== id)
        : [...state.expandedConflicts, id],
    })),

  toggleStepExpanded: (id) =>
    set((state) => ({
      expandedSteps: state.expandedSteps.includes(id)
        ? state.expandedSteps.filter((i) => i !== id)
        : [...state.expandedSteps, id],
    })),

  resetUI: () =>
    set({
      expandedJurisdictions: [],
      expandedConflicts: [],
      expandedSteps: [],
    }),
}));
