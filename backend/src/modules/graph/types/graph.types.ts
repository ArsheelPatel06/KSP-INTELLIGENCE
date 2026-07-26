import { Prisma } from '@prisma/client';
import type { PaginationInput } from '@core/pagination/pagination';

export type GraphEdgeDirection = 'incoming' | 'outgoing' | 'both';

export interface GraphNodeListQuery extends PaginationInput {
  nodeLabel?: string;
  sourceTable?: string;
  sensitivityLevel?: string;
  qualityStatus?: string;
  query?: string;
}

export interface GraphEdgeListQuery extends PaginationInput {
  fromKgNodeId?: bigint;
  toKgNodeId?: bigint;
  relationshipType?: string;
  reviewStatus?: string;
  sourceTable?: string;
  minConfidenceScore?: number;
}

export interface GraphNeighborQuery {
  relationshipType?: string;
  direction?: GraphEdgeDirection;
  minConfidenceScore?: number;
  limit?: number;
}

export const kgNodeSelect = {
  id: true,
  nodeLabel: true,
  sourceTable: true,
  sourceRecordId: true,
  displayName: true,
  sensitivityLevel: true,
  qualityStatus: true,
  sourceConfidence: true,
  dataSourceId: true,
  createdAt: true,
  updatedAt: true,
  dataSource: {
    select: {
      id: true,
      sourceName: true,
      sourceType: true,
      sourceBatch: true,
    },
  },
} satisfies Prisma.KgNodeSelect;

export const kgEdgeSelect = {
  id: true,
  fromKgNodeId: true,
  toKgNodeId: true,
  relationshipType: true,
  sourceTable: true,
  sourceRecordId: true,
  confidenceScore: true,
  edgeWeight: true,
  validFrom: true,
  validTo: true,
  evidenceId: true,
  dataSourceId: true,
  modelVersion: true,
  reviewStatus: true,
  explanation: true,
  createdAt: true,
  fromNode: {
    select: {
      id: true,
      nodeLabel: true,
      displayName: true,
      sourceTable: true,
      sourceRecordId: true,
    },
  },
  toNode: {
    select: {
      id: true,
      nodeLabel: true,
      displayName: true,
      sourceTable: true,
      sourceRecordId: true,
    },
  },
  evidence: {
    select: {
      id: true,
      evidenceType: true,
      evidenceDescription: true,
    },
  },
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true,
    },
  },
} satisfies Prisma.KgEdgeSelect;

export type GraphNodeRecord = Prisma.KgNodeGetPayload<{ select: typeof kgNodeSelect }>;
export type GraphEdgeRecord = Prisma.KgEdgeGetPayload<{ select: typeof kgEdgeSelect }>;

export interface GraphNeighborItem {
  direction: Exclude<GraphEdgeDirection, 'both'>;
  node: GraphNodeRecord;
  edge: GraphEdgeRecord;
}
