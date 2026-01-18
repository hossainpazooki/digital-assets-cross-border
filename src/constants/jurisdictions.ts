import type { JurisdictionCode, JurisdictionInfo } from '@/types/common';

export const JURISDICTION_LIST: JurisdictionInfo[] = [
  {
    code: 'EU',
    name: 'European Union',
    authority: 'ESMA',
    framework: 'MiCA 2023',
    flag: '🇪🇺',
    color: 'eu',
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    authority: 'FCA',
    framework: 'FCA Crypto 2024',
    flag: '🇬🇧',
    color: 'uk',
  },
  {
    code: 'US',
    name: 'United States',
    authority: 'SEC/CFTC',
    framework: 'Securities Act 1933',
    flag: '🇺🇸',
    color: 'us',
  },
  {
    code: 'CH',
    name: 'Switzerland',
    authority: 'FINMA',
    framework: 'FINSA/DLT 2021',
    flag: '🇨🇭',
    color: 'ch',
  },
  {
    code: 'SG',
    name: 'Singapore',
    authority: 'MAS',
    framework: 'PSA 2019',
    flag: '🇸🇬',
    color: 'sg',
  },
];

export const JURISDICTION_MAP: Record<JurisdictionCode, JurisdictionInfo> =
  JURISDICTION_LIST.reduce(
    (acc, j) => ({ ...acc, [j.code]: j }),
    {} as Record<JurisdictionCode, JurisdictionInfo>
  );

export function getJurisdictionInfo(code: JurisdictionCode): JurisdictionInfo {
  return JURISDICTION_MAP[code];
}

export function getJurisdictionColor(code: JurisdictionCode): string {
  const colors: Record<JurisdictionCode, string> = {
    EU: 'bg-blue-500',
    UK: 'bg-red-500',
    US: 'bg-green-500',
    CH: 'bg-amber-500',
    SG: 'bg-violet-500',
  };
  return colors[code] || 'bg-gray-500';
}

export function getJurisdictionTextColor(code: JurisdictionCode): string {
  const colors: Record<JurisdictionCode, string> = {
    EU: 'text-blue-400',
    UK: 'text-red-400',
    US: 'text-green-400',
    CH: 'text-amber-400',
    SG: 'text-violet-400',
  };
  return colors[code] || 'text-gray-400';
}
