// Jurisdiction codes matching backend JurisdictionCode enum
export type JurisdictionCode = 'EU' | 'UK' | 'US' | 'CH' | 'SG';

// Jurisdiction roles in cross-border scenarios
export type JurisdictionRole = 'issuer_home' | 'target' | 'passporting' | 'home' | 'passport' | 'third_country';

// Jurisdiction metadata
export interface JurisdictionInfo {
  code: JurisdictionCode;
  name: string;
  authority: string;
  framework: string;
  flag: string;
  color: string;
}
