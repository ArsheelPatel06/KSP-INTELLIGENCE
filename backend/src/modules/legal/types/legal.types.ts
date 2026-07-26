import { Prisma } from '@prisma/client';
import type { PaginationInput } from '@core/pagination/pagination';

export interface ActListQuery extends PaginationInput {
  active?: boolean;
  query?: string;
}

export interface SectionListQuery extends PaginationInput {
  actCode?: string;
  active?: boolean;
  query?: string;
}

export interface LegalDocumentListQuery extends PaginationInput {
  actCode?: string;
  query?: string;
}

export interface IpcReferenceListQuery extends PaginationInput {
  actCode?: string;
  sectionCode?: string;
  query?: string;
}

export const actSelect = {
  code: true,
  description: true,
  shortName: true,
  active: true,
  _count: {
    select: {
      sections: true,
      legalDocuments: true,
    },
  },
} satisfies Prisma.ActSelect;

export const legalSectionSelect = {
  actCode: true,
  sectionCode: true,
  description: true,
  active: true,
  act: {
    select: {
      code: true,
      shortName: true,
      description: true,
      active: true,
    },
  },
  ipcReferences: {
    select: {
      id: true,
      rawSectionLabel: true,
      descriptionText: true,
      offenseText: true,
      punishmentText: true,
      parseQualityStatus: true,
    },
  },
  keywordMappings: {
    select: {
      keyword: {
        select: {
          id: true,
          text: true,
          type: true,
        },
      },
    },
  },
} satisfies Prisma.LegalSectionSelect;

export const legalDocumentSelect = {
  id: true,
  actCode: true,
  title: true,
  sourceName: true,
  jurisdictionPlace: true,
  publishedDateText: true,
  commencementDateText: true,
  sourceUrl: true,
  parseQualityStatus: true,
  act: {
    select: {
      code: true,
      shortName: true,
      description: true,
    },
  },
} satisfies Prisma.LegalDocumentSourceSelect;

export const ipcReferenceSelect = {
  id: true,
  actCode: true,
  sectionCode: true,
  rawSectionLabel: true,
  descriptionText: true,
  offenseText: true,
  punishmentText: true,
  parseQualityStatus: true,
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
} satisfies Prisma.IpcSectionReferenceSelect;

export const crimeHeadSectionMappingSelect = {
  crimeHeadId: true,
  actCode: true,
  sectionCode: true,
  section: {
    select: legalSectionSelect,
  },
} satisfies Prisma.CrimeHeadActSectionSelect;

export type ActRecord = Prisma.ActGetPayload<{ select: typeof actSelect }>;
export type LegalSectionRecord = Prisma.LegalSectionGetPayload<{ select: typeof legalSectionSelect }>;
export type LegalDocumentRecord = Prisma.LegalDocumentSourceGetPayload<{ select: typeof legalDocumentSelect }>;
export type IpcReferenceRecord = Prisma.IpcSectionReferenceGetPayload<{ select: typeof ipcReferenceSelect }>;
export type CrimeHeadSectionMappingRecord = Prisma.CrimeHeadActSectionGetPayload<{ select: typeof crimeHeadSectionMappingSelect }>;
