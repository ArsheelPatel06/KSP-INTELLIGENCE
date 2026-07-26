import { Prisma } from '@prisma/client';
import type { PaginationInput } from '@core/pagination/pagination';

export interface VictimListFilters {
  caseMasterId?: bigint;
  genderId?: bigint;
  victimPolice?: boolean;
  districtId?: bigint;
  minAge?: number;
  maxAge?: number;
  query?: string;
}

export interface VictimListQuery extends PaginationInput, VictimListFilters {}

export const victimListSelect = {
  id: true,
  victimNameHash: true,
  ageYear: true,
  victimPolice: true,
  gender: {
    select: {
      id: true,
      name: true,
    },
  },
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      crimeRegisteredDate: true,
      policeStation: {
        select: {
          id: true,
          name: true,
          district: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      status: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  _count: {
    select: {
      propertyAssets: true,
      vehicles: true,
      digitalIdentifiers: true,
      financialAccounts: true,
      weapons: true,
      riskScores: true,
    },
  },
} satisfies Prisma.VictimSelect;

export const victimDetailInclude = {
  gender: true,
  case: {
    include: {
      policeStation: {
        include: {
          district: true,
          state: true,
        },
      },
      status: true,
      majorCrimeHead: true,
      minorCrimeHead: true,
    },
  },
  propertyAssets: true,
  vehicles: true,
  digitalIdentifiers: true,
  financialAccounts: true,
  weapons: true,
  riskScores: {
    orderBy: {
      generatedOn: 'desc',
    },
  },
} satisfies Prisma.VictimInclude;

export const riskScoreSelect = {
  id: true,
  scoreSubjectType: true,
  scoreType: true,
  scoreValue: true,
  riskLevel: true,
  explanationText: true,
  confidenceScore: true,
  modelVersion: true,
  generatedOn: true,
  reviewStatus: true,
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true,
    },
  },
} satisfies Prisma.RiskScoreSelect;

export type VictimListItem = Prisma.VictimGetPayload<{ select: typeof victimListSelect }>;
export type VictimDetailRecord = Prisma.VictimGetPayload<{ include: typeof victimDetailInclude }>;
export type VictimRiskScoreItem = Prisma.RiskScoreGetPayload<{ select: typeof riskScoreSelect }>;
