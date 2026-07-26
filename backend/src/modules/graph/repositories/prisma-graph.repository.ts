import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@core/database/prisma';
import { buildPaginationMeta, normalizePagination } from '@core/pagination/pagination';
import type { GraphRepository } from '../interfaces/graph-repository.interface';
import {
  kgEdgeSelect,
  kgNodeSelect,
  type GraphEdgeListQuery,
  type GraphEdgeRecord,
  type GraphNeighborItem,
  type GraphNeighborQuery,
  type GraphNodeListQuery,
  type GraphNodeRecord,
} from '../types/graph.types';

export class PrismaGraphRepository implements GraphRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findById(id: bigint): Promise<GraphNodeRecord | null> {
    return this.client.kgNode.findUnique({
      where: { id },
      select: kgNodeSelect,
    });
  }

  async findNodeBySource(sourceTable: string, sourceRecordId: string, nodeLabel?: string): Promise<GraphNodeRecord | null> {
    return this.client.kgNode.findFirst({
      where: {
        sourceTable,
        sourceRecordId,
        ...(nodeLabel ? { nodeLabel } : {}),
      },
      select: kgNodeSelect,
    });
  }

  async searchNodes(input: GraphNodeListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildNodeWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.kgNode.findMany({
        where,
        select: kgNodeSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ nodeLabel: 'asc' }, { displayName: 'asc' }, { id: 'asc' }],
      }),
      this.client.kgNode.count({ where }),
    ]);

    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords,
      }),
    };
  }

  async findEdgeById(id: bigint): Promise<GraphEdgeRecord | null> {
    return this.client.kgEdge.findUnique({
      where: { id },
      select: kgEdgeSelect,
    });
  }

  async listEdges(input: GraphEdgeListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildEdgeWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.kgEdge.findMany({
        where,
        select: kgEdgeSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ confidenceScore: 'desc' }, { id: 'desc' }],
      }),
      this.client.kgEdge.count({ where }),
    ]);

    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords,
      }),
    };
  }

  async listOutgoingEdges(nodeId: bigint, input: Omit<GraphEdgeListQuery, 'fromKgNodeId'> = {}) {
    return this.listEdges({ ...input, fromKgNodeId: nodeId });
  }

  async listIncomingEdges(nodeId: bigint, input: Omit<GraphEdgeListQuery, 'toKgNodeId'> = {}) {
    return this.listEdges({ ...input, toKgNodeId: nodeId });
  }

  async listNeighbors(nodeId: bigint, input: GraphNeighborQuery = {}): Promise<GraphNeighborItem[]> {
    const direction = input.direction ?? 'both';
    const take = Math.max(input.limit ?? 25, 1);
    const confidenceFilter = typeof input.minConfidenceScore === 'number'
      ? { gte: input.minConfidenceScore }
      : undefined;

    const outgoingPromise =
      direction === 'incoming'
        ? Promise.resolve([] as GraphEdgeRecord[])
        : this.client.kgEdge.findMany({
            where: {
              fromKgNodeId: nodeId,
              ...(input.relationshipType ? { relationshipType: input.relationshipType } : {}),
              ...(confidenceFilter ? { confidenceScore: confidenceFilter } : {}),
            },
            select: kgEdgeSelect,
            take,
            orderBy: [{ confidenceScore: 'desc' }, { id: 'desc' }],
          });

    const incomingPromise =
      direction === 'outgoing'
        ? Promise.resolve([] as GraphEdgeRecord[])
        : this.client.kgEdge.findMany({
            where: {
              toKgNodeId: nodeId,
              ...(input.relationshipType ? { relationshipType: input.relationshipType } : {}),
              ...(confidenceFilter ? { confidenceScore: confidenceFilter } : {}),
            },
            select: kgEdgeSelect,
            take,
            orderBy: [{ confidenceScore: 'desc' }, { id: 'desc' }],
          });

    const [outgoingEdges, incomingEdges] = await Promise.all([outgoingPromise, incomingPromise]);

    const outgoingNeighbors: GraphNeighborItem[] = outgoingEdges.map((edge) => ({
      direction: 'outgoing',
      node: {
        id: edge.toNode.id,
        nodeLabel: edge.toNode.nodeLabel,
        sourceTable: edge.toNode.sourceTable,
        sourceRecordId: edge.toNode.sourceRecordId,
        displayName: edge.toNode.displayName,
        sensitivityLevel: null,
        qualityStatus: null,
        sourceConfidence: null,
        dataSourceId: null,
        createdAt: edge.createdAt,
        updatedAt: edge.createdAt,
        dataSource: null,
      },
      edge,
    }));

    const incomingNeighbors: GraphNeighborItem[] = incomingEdges.map((edge) => ({
      direction: 'incoming',
      node: {
        id: edge.fromNode.id,
        nodeLabel: edge.fromNode.nodeLabel,
        sourceTable: edge.fromNode.sourceTable,
        sourceRecordId: edge.fromNode.sourceRecordId,
        displayName: edge.fromNode.displayName,
        sensitivityLevel: null,
        qualityStatus: null,
        sourceConfidence: null,
        dataSourceId: null,
        createdAt: edge.createdAt,
        updatedAt: edge.createdAt,
        dataSource: null,
      },
      edge,
    }));

    return [...outgoingNeighbors, ...incomingNeighbors].sort((left, right) => {
      const leftConfidence = left.edge.confidenceScore ? Number(left.edge.confidenceScore) : -1;
      const rightConfidence = right.edge.confidenceScore ? Number(right.edge.confidenceScore) : -1;

      return rightConfidence - leftConfidence;
    });
  }

  private buildNodeWhere(input: GraphNodeListQuery): Prisma.KgNodeWhereInput {
    const where: Prisma.KgNodeWhereInput = {};
    const and: Prisma.KgNodeWhereInput[] = [];

    if (input.nodeLabel) {
      and.push({ nodeLabel: input.nodeLabel });
    }

    if (input.sourceTable) {
      and.push({ sourceTable: input.sourceTable });
    }

    if (input.sensitivityLevel) {
      and.push({ sensitivityLevel: input.sensitivityLevel });
    }

    if (input.qualityStatus) {
      and.push({ qualityStatus: input.qualityStatus });
    }

    if (input.query) {
      and.push({
        OR: [
          {
            displayName: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            sourceRecordId: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }

  private buildEdgeWhere(input: GraphEdgeListQuery): Prisma.KgEdgeWhereInput {
    const where: Prisma.KgEdgeWhereInput = {};
    const and: Prisma.KgEdgeWhereInput[] = [];

    if (input.fromKgNodeId) {
      and.push({ fromKgNodeId: input.fromKgNodeId });
    }

    if (input.toKgNodeId) {
      and.push({ toKgNodeId: input.toKgNodeId });
    }

    if (input.relationshipType) {
      and.push({ relationshipType: input.relationshipType });
    }

    if (input.reviewStatus) {
      and.push({ reviewStatus: input.reviewStatus });
    }

    if (input.sourceTable) {
      and.push({ sourceTable: input.sourceTable });
    }

    if (typeof input.minConfidenceScore === 'number') {
      and.push({
        confidenceScore: {
          gte: input.minConfidenceScore,
        },
      });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }
}
