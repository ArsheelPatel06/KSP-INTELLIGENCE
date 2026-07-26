import { Prisma } from '@prisma/client';
import type { PaginationInput } from '@core/pagination/pagination';

export interface OfficerListFilters {
  districtId?: bigint;
  unitId?: bigint;
  rankId?: bigint;
  designationId?: bigint;
  active?: boolean;
  query?: string;
}

export interface OfficerListQuery extends PaginationInput, OfficerListFilters {}

export const officerListSelect = {
  id: true,
  kgid: true,
  firstName: true,
  employeeDob: true,
  appointmentDate: true,
  active: true,
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
  rank: {
    select: {
      id: true,
      name: true,
      hierarchyLevel: true,
    },
  },
  designation: {
    select: {
      id: true,
      name: true,
    },
  },
  gender: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      registeredCases: true,
      arrestInvestigations: true,
      chargesheets: true,
      diaryEntries: true,
      assignedAlerts: true,
      assignedTasks: true,
      recommendationReviews: true,
      similarityReviews: true,
    },
  },
} satisfies Prisma.EmployeeSelect;

export const officerDetailInclude = {
  district: true,
  unit: {
    include: {
      unitType: true,
      district: true,
      state: true,
    },
  },
  rank: true,
  designation: true,
  gender: true,
  registeredCases: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      crimeRegisteredDate: true,
      briefFacts: true,
      status: {
        select: {
          id: true,
          name: true,
        },
      },
      policeStation: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      crimeRegisteredDate: 'desc',
    },
  },
  chargesheets: {
    include: {
      case: true,
    },
    orderBy: {
      date: 'desc',
    },
  },
  assignedAlerts: {
    orderBy: {
      generatedOn: 'desc',
    },
  },
  assignedTasks: {
    orderBy: {
      createdAt: 'desc',
    },
  },
  recommendationReviews: {
    orderBy: {
      generatedOn: 'desc',
    },
  },
  similarityReviews: {
    orderBy: {
      generatedOn: 'desc',
    },
  },
  _count: {
    select: {
      registeredCases: true,
      arrestInvestigations: true,
      chargesheets: true,
      diaryEntries: true,
      assignedAlerts: true,
      assignedTasks: true,
      recommendationReviews: true,
      similarityReviews: true,
      reviewedKnowledgeGraphEdges: true,
    },
  },
} satisfies Prisma.EmployeeInclude;

export const officerAssignedCaseSelect = {
  id: true,
  crimeNo: true,
  caseNo: true,
  crimeRegisteredDate: true,
  briefFacts: true,
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
  _count: {
    select: {
      victims: true,
      accused: true,
      evidence: true,
      tasks: true,
      alerts: true,
    },
  },
} satisfies Prisma.CaseMasterSelect;

export type OfficerListItem = Prisma.EmployeeGetPayload<{ select: typeof officerListSelect }>;
export type OfficerDetailRecord = Prisma.EmployeeGetPayload<{ include: typeof officerDetailInclude }>;
export type OfficerAssignedCaseItem = Prisma.CaseMasterGetPayload<{ select: typeof officerAssignedCaseSelect }>;
