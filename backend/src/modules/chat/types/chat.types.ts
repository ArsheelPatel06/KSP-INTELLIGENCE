import { Prisma } from '@prisma/client';
import type { PaginationInput } from '@core/pagination/pagination';

export interface ChatSessionListQuery extends PaginationInput {
  caseMasterId?: bigint;
  employeeId?: bigint;
  fromDate?: Date;
  toDate?: Date;
}

export interface CreateChatSessionInput {
  employeeId?: bigint;
  caseMasterId?: bigint;
  sessionPurpose: string;
  securityClassification?: string;
  modelVersion?: string;
}

export interface SendChatMessageInput {
  messageText: string;
  includeEvidence?: boolean;
  includeGraph?: boolean;
  includeLegal?: boolean;
  includeAnalytics?: boolean;
}

export const chatSessionListSelect = {
  id: true,
  employeeId: true,
  caseMasterId: true,
  sessionStartedOn: true,
  sessionEndedOn: true,
  sessionPurpose: true,
  securityClassification: true,
  modelVersion: true,
  employee: {
    select: {
      id: true,
      kgid: true,
      firstName: true,
    },
  },
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
    },
  },
  _count: {
    select: {
      messages: true,
    },
  },
} satisfies Prisma.ChatSessionSelect;

export const chatSessionDetailSelect = {
  id: true,
  employeeId: true,
  caseMasterId: true,
  sessionStartedOn: true,
  sessionEndedOn: true,
  sessionPurpose: true,
  securityClassification: true,
  modelVersion: true,
  employee: {
    select: {
      id: true,
      kgid: true,
      firstName: true,
    },
  },
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      briefFacts: true,
    },
  },
  messages: {
    select: {
      id: true,
      messageSequence: true,
      senderRole: true,
      messageText: true,
      createdOn: true,
      linkedRecommendationId: true,
      linkedAuditLogId: true,
    },
    orderBy: [{ messageSequence: 'asc' }],
  },
} satisfies Prisma.ChatSessionSelect;

export const chatMessageSelect = {
  id: true,
  chatSessionId: true,
  messageSequence: true,
  senderRole: true,
  messageText: true,
  createdOn: true,
  linkedRecommendationId: true,
  linkedAuditLogId: true,
} satisfies Prisma.ChatMessageSelect;

export type ChatSessionListItem = Prisma.ChatSessionGetPayload<{ select: typeof chatSessionListSelect }>;
export type ChatSessionDetailRecord = Prisma.ChatSessionGetPayload<{ select: typeof chatSessionDetailSelect }>;
export type ChatMessageRecord = Prisma.ChatMessageGetPayload<{ select: typeof chatMessageSelect }>;

export interface StructuredChatAnswer {
  summary: string;
  evidence: string[];
  connections: string[];
  insights: string[];
  suggestedLeads: string[];
  confidence: {
    label: 'Low' | 'Medium' | 'High';
    score: number;
    reason: string;
  };
  nextAction: string;
}
