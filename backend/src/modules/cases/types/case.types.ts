import { Prisma } from '@prisma/client';
import type { PaginationInput } from '@core/pagination/pagination';

export interface CaseListFilters {
  crimeNo?: string;
  caseNo?: string;
  policeStationId?: bigint;
  policePersonId?: bigint;
  caseStatusId?: bigint;
  crimeMajorHeadId?: bigint;
  crimeMinorHeadId?: bigint;
  districtId?: bigint;
  fromCrimeRegisteredDate?: Date;
  toCrimeRegisteredDate?: Date;
  query?: string;
}

export interface CaseListQuery extends PaginationInput, CaseListFilters {}

export const caseListSelect = {
  id: true,
  crimeNo: true,
  caseNo: true,
  crimeRegisteredDate: true,
  incidentFromDate: true,
  incidentToDate: true,
  briefFacts: true,
  latitude: true,
  longitude: true,
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
  policePerson: {
    select: {
      id: true,
      kgid: true,
      firstName: true,
      rank: {
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
  category: {
    select: {
      id: true,
      lookupValue: true,
    },
  },
  majorCrimeHead: {
    select: {
      id: true,
      groupName: true,
    },
  },
  minorCrimeHead: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      complainants: true,
      victims: true,
      accused: true,
      evidence: true,
      vehicles: true,
      digitalIdentifiers: true,
      financialTransactions: true,
    },
  },
} satisfies Prisma.CaseMasterSelect;

export const caseDetailInclude = {
  policePerson: {
    include: {
      rank: true,
      designation: true,
      unit: true,
      district: true,
    },
  },
  policeStation: {
    include: {
      unitType: true,
      district: true,
      state: true,
    },
  },
  category: true,
  gravity: true,
  majorCrimeHead: true,
  minorCrimeHead: true,
  status: true,
  court: true,
  dataSource: true,
  complainants: {
    include: {
      occupation: true,
      religion: true,
      caste: true,
      gender: true,
    },
  },
  victims: {
    include: {
      gender: true,
      riskScores: {
        orderBy: {
          generatedOn: 'desc',
        },
      },
    },
  },
  accused: {
    include: {
      gender: true,
      riskScores: {
        orderBy: {
          generatedOn: 'desc',
        },
      },
      offenderLinks: {
        include: {
          profile: true,
        },
      },
      gangMemberships: {
        include: {
          network: true,
        },
      },
    },
  },
  actSections: {
    include: {
      section: {
        include: {
          act: true,
          ipcReferences: true,
        },
      },
    },
    orderBy: [{ actOrderId: 'asc' }, { sectionOrderId: 'asc' }],
  },
  chargesheets: {
    include: {
      policePerson: true,
    },
  },
  occurrence: true,
  evidence: true,
  vehicles: true,
  digitalIdentifiers: true,
  financialAccounts: true,
  financialTransactions: true,
  weapons: true,
  documents: true,
  forensicReports: true,
  witnesses: {
    include: {
      gender: true,
    },
  },
  diaryEntries: {
    include: {
      employee: true,
    },
    orderBy: {
      entryDateTime: 'desc',
    },
  },
  courtProceedings: {
    include: {
      court: true,
    },
    orderBy: {
      proceedingDate: 'desc',
    },
  },
  custodyStatuses: {
    include: {
      accused: true,
      court: true,
      jail: true,
    },
    orderBy: {
      startDate: 'desc',
    },
  },
  modusOperandi: true,
  socialRelationships: true,
  riskScores: {
    orderBy: {
      generatedOn: 'desc',
    },
  },
  recommendations: {
    include: {
      legalSections: {
        include: {
          section: {
            include: {
              act: true,
            },
          },
        },
      },
    },
    orderBy: {
      generatedOn: 'desc',
    },
  },
  alerts: {
    orderBy: {
      generatedOn: 'desc',
    },
  },
  tasks: {
    orderBy: {
      createdAt: 'desc',
    },
  },
  _count: {
    select: {
      complainants: true,
      victims: true,
      accused: true,
      evidence: true,
      vehicles: true,
      digitalIdentifiers: true,
      financialTransactions: true,
      chatSessions: true,
      searchRequests: true,
    },
  },
} satisfies Prisma.CaseMasterInclude;

export const caseSimilaritySelect = {
  id: true,
  sourceCaseMasterId: true,
  matchedCaseMasterId: true,
  similarityScore: true,
  similarityType: true,
  reasonFeatures: true,
  modelVersion: true,
  generatedOn: true,
  reviewStatus: true,
  sourceCase: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      briefFacts: true,
      policeStation: {
        select: {
          id: true,
          name: true,
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
  matchedCase: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      briefFacts: true,
      policeStation: {
        select: {
          id: true,
          name: true,
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
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true,
    },
  },
} satisfies Prisma.CaseSimilaritySelect;

export type CaseListItem = Prisma.CaseMasterGetPayload<{ select: typeof caseListSelect }>;
export type CaseDetailRecord = Prisma.CaseMasterGetPayload<{ include: typeof caseDetailInclude }>;
export type CaseSimilarityItem = Prisma.CaseSimilarityGetPayload<{
  select: typeof caseSimilaritySelect;
}>;
