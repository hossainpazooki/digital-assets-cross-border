// Instrument types
export type InstrumentType =
  | 'stablecoin'
  | 'security_token'
  | 'utility_token'
  | 'nft'
  | 'governance_token'
  | 'lp_token'
  | 'other';

// Activity types
export type ActivityType =
  | 'public_offer'
  | 'private_placement'
  | 'trading'
  | 'custody'
  | 'exchange'
  | 'lending'
  | 'staking';

// Investor types
export type InvestorType = 'retail' | 'professional' | 'institutional' | 'accredited';
