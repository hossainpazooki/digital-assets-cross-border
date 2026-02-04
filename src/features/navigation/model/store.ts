import { create } from 'zustand';
import type { JurisdictionCode, InstrumentType, ActivityType, InvestorType } from '@/types/common';

interface NavigationFormState {
  // Form inputs
  issuerJurisdiction: JurisdictionCode;
  targetJurisdictions: JurisdictionCode[];
  instrumentType: InstrumentType | string;
  activity: ActivityType | string;
  investorTypes: InvestorType[];
  amount: number;

  // Actions
  setIssuerJurisdiction: (jurisdiction: JurisdictionCode) => void;
  toggleTargetJurisdiction: (jurisdiction: JurisdictionCode) => void;
  setInstrumentType: (type: InstrumentType | string) => void;
  setActivity: (activity: ActivityType | string) => void;
  toggleInvestorType: (type: InvestorType) => void;
  setAmount: (amount: number) => void;
  reset: () => void;
}

const initialState = {
  issuerJurisdiction: 'CH' as JurisdictionCode,
  targetJurisdictions: ['EU', 'UK'] as JurisdictionCode[],
  instrumentType: 'stablecoin' as InstrumentType,
  activity: 'public_offer' as ActivityType,
  investorTypes: ['professional'] as InvestorType[],
  amount: 5000000,
};

export const useNavigationStore = create<NavigationFormState>((set) => ({
  ...initialState,

  setIssuerJurisdiction: (jurisdiction) =>
    set({ issuerJurisdiction: jurisdiction }),

  toggleTargetJurisdiction: (jurisdiction) =>
    set((state) => ({
      targetJurisdictions: state.targetJurisdictions.includes(jurisdiction)
        ? state.targetJurisdictions.filter((j) => j !== jurisdiction)
        : [...state.targetJurisdictions, jurisdiction],
    })),

  setInstrumentType: (type) => set({ instrumentType: type }),

  setActivity: (activity) => set({ activity: activity }),

  toggleInvestorType: (type) =>
    set((state) => ({
      investorTypes: state.investorTypes.includes(type)
        ? state.investorTypes.filter((t) => t !== type)
        : [...state.investorTypes, type],
    })),

  setAmount: (amount) => set({ amount: amount }),

  reset: () => set(initialState),
}));
