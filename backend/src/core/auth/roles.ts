export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DGP: 'DGP',
  IG: 'IG',
  SP: 'SP',
  DSP: 'DSP',
  INSPECTOR: 'INSPECTOR',
  SI: 'SI',
  CONSTABLE: 'CONSTABLE',
  CRIME_ANALYST: 'CRIME_ANALYST',
  POLICY_MAKER: 'POLICY_MAKER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_VALUES = Object.values(ROLES) as [Role, ...Role[]];
