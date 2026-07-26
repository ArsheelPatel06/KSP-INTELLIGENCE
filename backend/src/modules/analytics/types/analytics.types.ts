import { Prisma } from '@prisma/client';
import type { PaginationInput } from '@core/pagination/pagination';

export interface CrimeStatisticListQuery extends PaginationInput {
  reportYear?: number;
  reportMonth?: number;
  districtId?: bigint;
  unitId?: bigint;
  crimeHeadId?: bigint;
  crimeSubHeadId?: bigint;
  isProvisional?: boolean;
}

export interface CrimeStatisticAggregate {
  totalRecords: number;
  totalCurrentMonthCount: Prisma.Decimal | null;
  totalYearToDateCount: Prisma.Decimal | null;
  totalPreviousMonthCount: Prisma.Decimal | null;
  totalCorrespondingPreviousYearCount: Prisma.Decimal | null;
}

export interface VictimDemographicListQuery extends PaginationInput {
  statisticYear?: number;
  stateId?: bigint;
  crimeContext?: string;
  purposeLabel?: string;
  genderLabel?: string;
  ageBandLabel?: string;
}

export interface CyberSuspectStatisticListQuery extends PaginationInput {
  statisticYear?: number;
  stateId?: bigint;
  crimeHeadLabel?: string;
  suspectCategory?: string;
}

export interface HotspotListQuery extends PaginationInput {
  districtId?: bigint;
  unitId?: bigint;
  crimeHeadId?: bigint;
  crimeSubHeadId?: bigint;
  riskLevel?: string;
  trendDirection?: string;
  minConfidenceScore?: number;
}

export interface RiskScoreListQuery extends PaginationInput {
  scoreSubjectType?: string;
  scoreType?: string;
  riskLevel?: string;
  reviewStatus?: string;
  caseMasterId?: bigint;
  accusedMasterId?: bigint;
  victimMasterId?: bigint;
  hotspotId?: bigint;
}

export interface RecommendationListQuery extends PaginationInput {
  recommendationType?: string;
  status?: string;
  priorityLevel?: string;
  caseMasterId?: bigint;
  hotspotId?: bigint;
  riskScoreId?: bigint;
  minConfidenceScore?: number;
}

export interface RepeatOffenderProfileListQuery extends PaginationInput {
  primaryDistrictId?: bigint;
  riskLevel?: string;
  profileStatus?: string;
  query?: string;
}

export interface CrimeReviewReportListQuery extends PaginationInput {
  reportYear?: number;
  reportMonth?: number;
  isProvisional?: boolean;
  query?: string;
}

export const crimeStatisticSelect = {
  id: true,
  reportMonth: true,
  reportYear: true,
  rawActLabel: true,
  rawMajorHead: true,
  rawMinorHead: true,
  currentMonthCount: true,
  yearToDateCount: true,
  previousMonthCount: true,
  correspondingPreviousYearCount: true,
  measureNotes: true,
  isProvisional: true,
  district: {
    select: {
      id: true,
      name: true,
    },
  },
  unit: {
    select: {
      id: true,
      name: true,
    },
  },
  crimeHead: {
    select: {
      id: true,
      groupName: true,
    },
  },
  crimeSubHead: {
    select: {
      id: true,
      name: true,
    },
  },
  dataSource: {
    select: {
      id: true,
      sourceName: true,
      sourceBatch: true,
    },
  },
} satisfies Prisma.CrimeStatisticSelect;

export const victimDemographicSelect = {
  id: true,
  statisticYear: true,
  stateUtNameRaw: true,
  crimeContext: true,
  purposeLabel: true,
  genderLabel: true,
  ageBandLabel: true,
  caseCount: true,
  victimCount: true,
  maleCount: true,
  femaleCount: true,
  grandTotal: true,
  state: {
    select: {
      id: true,
      name: true,
    },
  },
  dataSource: {
    select: {
      id: true,
      sourceName: true,
    },
  },
} satisfies Prisma.VictimDemographicStatisticSelect;

export const cyberSuspectStatisticSelect = {
  id: true,
  statisticYear: true,
  stateUtNameRaw: true,
  crimeHeadLabel: true,
  suspectCategory: true,
  suspectCount: true,
  totalCount: true,
  state: {
    select: {
      id: true,
      name: true,
    },
  },
  dataSource: {
    select: {
      id: true,
      sourceName: true,
    },
  },
} satisfies Prisma.CyberSuspectStatisticSelect;

export const hotspotSelect = {
  id: true,
  hotspotName: true,
  timeWindowStart: true,
  timeWindowEnd: true,
  boundaryReference: true,
  centerLatitude: true,
  centerLongitude: true,
  riskLevel: true,
  confidenceScore: true,
  trendDirection: true,
  generatedOn: true,
  modelVersion: true,
  district: {
    select: {
      id: true,
      name: true,
    },
  },
  unit: {
    select: {
      id: true,
      name: true,
    },
  },
  crimeHead: {
    select: {
      id: true,
      groupName: true,
    },
  },
  crimeSubHead: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      cases: true,
      riskScores: true,
      recommendations: true,
      alerts: true,
    },
  },
} satisfies Prisma.HotspotSelect;

export const hotspotDetailSelect = {
  id: true,
  hotspotName: true,
  timeWindowStart: true,
  timeWindowEnd: true,
  boundaryReference: true,
  centerLatitude: true,
  centerLongitude: true,
  riskLevel: true,
  confidenceScore: true,
  trendDirection: true,
  generatedOn: true,
  modelVersion: true,
  district: {
    select: {
      id: true,
      name: true,
    },
  },
  unit: {
    select: {
      id: true,
      name: true,
    },
  },
  crimeHead: {
    select: {
      id: true,
      groupName: true,
    },
  },
  crimeSubHead: {
    select: {
      id: true,
      name: true,
    },
  },
  cases: {
    select: {
      id: true,
      contributionScore: true,
      matchReason: true,
      case: {
        select: {
          id: true,
          crimeNo: true,
          caseNo: true,
          briefFacts: true,
          crimeRegisteredDate: true,
          policeStation: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ contributionScore: 'desc' }, { id: 'asc' }],
  },
  recommendations: {
    select: {
      id: true,
      recommendationType: true,
      recommendationText: true,
      confidenceScore: true,
      priorityLevel: true,
      status: true,
      generatedOn: true,
    },
    orderBy: [{ generatedOn: 'desc' }, { id: 'desc' }],
  },
  riskScores: {
    select: {
      id: true,
      scoreType: true,
      scoreValue: true,
      riskLevel: true,
      confidenceScore: true,
      generatedOn: true,
    },
    orderBy: [{ generatedOn: 'desc' }, { id: 'desc' }],
  },
  _count: {
    select: {
      cases: true,
      riskScores: true,
      recommendations: true,
      alerts: true,
    },
  },
} satisfies Prisma.HotspotSelect;

export const riskScoreSelect = {
  id: true,
  scoreSubjectType: true,
  caseMasterId: true,
  accusedMasterId: true,
  victimMasterId: true,
  unitId: true,
  hotspotId: true,
  scoreType: true,
  scoreValue: true,
  riskLevel: true,
  explanationText: true,
  confidenceScore: true,
  modelVersion: true,
  generatedOn: true,
  reviewStatus: true,
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
    },
  },
  accused: {
    select: {
      id: true,
      accusedNameHash: true,
      personId: true,
    },
  },
  victim: {
    select: {
      id: true,
      victimNameHash: true,
    },
  },
  unit: {
    select: {
      id: true,
      name: true,
    },
  },
  hotspot: {
    select: {
      id: true,
      hotspotName: true,
    },
  },
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true,
    },
  },
} satisfies Prisma.RiskScoreSelect;

export const recommendationSelect = {
  id: true,
  recommendationType: true,
  recommendationText: true,
  rationaleText: true,
  confidenceScore: true,
  priorityLevel: true,
  modelVersion: true,
  generatedOn: true,
  status: true,
  reviewNotes: true,
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
    },
  },
  hotspot: {
    select: {
      id: true,
      hotspotName: true,
    },
  },
  riskScore: {
    select: {
      id: true,
      scoreType: true,
      scoreValue: true,
      riskLevel: true,
    },
  },
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true,
    },
  },
  legalSections: {
    select: {
      id: true,
      recommendationAction: true,
      reasonText: true,
      confidenceScore: true,
      section: {
        select: {
          actCode: true,
          sectionCode: true,
          description: true,
          act: {
            select: {
              code: true,
              shortName: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.RecommendationSelect;

export const repeatOffenderProfileSelect = {
  id: true,
  profileNameHash: true,
  identityConfidence: true,
  knownAliasText: true,
  firstKnownCaseDate: true,
  lastKnownCaseDate: true,
  totalLinkedCases: true,
  totalConvictions: true,
  riskLevel: true,
  profileStatus: true,
  primaryDistrict: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      accusedLinks: true,
      gangMemberships: true,
    },
  },
} satisfies Prisma.RepeatOffenderProfileSelect;

export const crimeReviewReportSelect = {
  id: true,
  reportTitle: true,
  reportMonth: true,
  reportYear: true,
  publishedBy: true,
  classificationAsOfDate: true,
  isProvisional: true,
  summaryText: true,
  dataSource: {
    select: {
      id: true,
      sourceName: true,
      sourceBatch: true,
    },
  },
  _count: {
    select: {
      sections: true,
    },
  },
} satisfies Prisma.CrimeReviewReportSelect;

export type CrimeStatisticRecord = Prisma.CrimeStatisticGetPayload<{
  select: typeof crimeStatisticSelect;
}>;
export type VictimDemographicRecord = Prisma.VictimDemographicStatisticGetPayload<{
  select: typeof victimDemographicSelect;
}>;
export type CyberSuspectStatisticRecord = Prisma.CyberSuspectStatisticGetPayload<{
  select: typeof cyberSuspectStatisticSelect;
}>;
export type HotspotRecord = Prisma.HotspotGetPayload<{ select: typeof hotspotSelect }>;
export type HotspotDetailRecord = Prisma.HotspotGetPayload<{ select: typeof hotspotDetailSelect }>;
export type RiskScoreRecord = Prisma.RiskScoreGetPayload<{ select: typeof riskScoreSelect }>;
export type RecommendationRecord = Prisma.RecommendationGetPayload<{
  select: typeof recommendationSelect;
}>;
export type RepeatOffenderProfileRecord = Prisma.RepeatOffenderProfileGetPayload<{
  select: typeof repeatOffenderProfileSelect;
}>;
export type CrimeReviewReportRecord = Prisma.CrimeReviewReportGetPayload<{
  select: typeof crimeReviewReportSelect;
}>;
