import type { InstrumentType, ActivityType, InvestorType } from './types';

export interface InstrumentOption {
  value: InstrumentType | string;
  label: string;
  description: string;
  icon: string;
}

export const INSTRUMENT_TYPES: InstrumentOption[] = [
  {
    value: 'stablecoin',
    label: 'Stablecoin',
    description: 'Asset-referenced token pegged to fiat currency',
    icon: '💵',
  },
  {
    value: 'security_token',
    label: 'Security Token',
    description: 'Tokenized securities or investment contracts',
    icon: '📜',
  },
  {
    value: 'utility_token',
    label: 'Utility Token',
    description: 'Token providing access to a service or platform',
    icon: '🎟️',
  },
  {
    value: 'governance_token',
    label: 'Governance Token',
    description: 'Token granting voting rights in a protocol',
    icon: '🗳️',
  },
  {
    value: 'nft',
    label: 'NFT',
    description: 'Non-fungible token for unique digital assets',
    icon: '🖼️',
  },
  {
    value: 'lp_token',
    label: 'LP Token',
    description: 'Liquidity pool token representing pool shares',
    icon: '💧',
  },
];

export interface ActivityOption {
  value: ActivityType | string;
  label: string;
  description: string;
  icon: string;
}

export const ACTIVITY_TYPES: ActivityOption[] = [
  {
    value: 'public_offer',
    label: 'Public Offering',
    description: 'Offering to the general public',
    icon: '📢',
  },
  {
    value: 'private_placement',
    label: 'Private Placement',
    description: 'Offering to qualified investors',
    icon: '🔒',
  },
  {
    value: 'trading',
    label: 'Secondary Trading',
    description: 'Secondary market trading',
    icon: '🔄',
  },
  {
    value: 'custody',
    label: 'Custody',
    description: 'Asset safekeeping services',
    icon: '🏦',
  },
  {
    value: 'staking',
    label: 'Staking',
    description: 'Proof-of-stake validation services',
    icon: '📈',
  },
  {
    value: 'lending',
    label: 'DeFi Lending',
    description: 'Crypto lending and borrowing',
    icon: '💰',
  },
];

export interface InvestorOption {
  value: InvestorType;
  label: string;
  description: string;
  icon: string;
}

export const INVESTOR_TYPES: InvestorOption[] = [
  {
    value: 'retail',
    label: 'Retail',
    description: 'Individual non-professional investors',
    icon: '👤',
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Qualified professional investors',
    icon: '👔',
  },
  {
    value: 'institutional',
    label: 'Institutional',
    description: 'Banks, funds, and large institutions',
    icon: '🏛️',
  },
  {
    value: 'accredited',
    label: 'Accredited',
    description: 'Accredited investors (US)',
    icon: '✓',
  },
];
