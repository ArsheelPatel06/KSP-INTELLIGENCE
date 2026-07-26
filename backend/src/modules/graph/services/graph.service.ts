import { StatusCodes } from 'http-status-codes';
import type { ServiceResult } from '@core/interfaces/service.interface';
import { AppError } from '@core/exceptions/app-error';
import type { GraphRepository } from '../interfaces/graph-repository.interface';
import type {
  GraphEdgeListQuery,
  GraphEdgeRecord,
  GraphNeighborItem,
  GraphNeighborQuery,
  GraphNodeListQuery,
  GraphNodeRecord,
} from '../types/graph.types';

export interface GetCaseGraphInput {
  depth?: number;
  includeEvidence?: boolean;
  includeInferred?: boolean;
}

export interface CaseGraphResult {
  centerNode: GraphNodeRecord | null;
  nodes: GraphNodeRecord[];
  edges: GraphEdgeRecord[];
}

export interface ExpandedGraphResult {
  centerNode: GraphNodeRecord;
  nodes: GraphNodeRecord[];
  edges: GraphEdgeRecord[];
}

export class GraphService {
  constructor(private readonly repository: GraphRepository) {}

  async getNodeById(nodeId: bigint): Promise<ServiceResult<GraphNodeRecord>> {
    const record = await this.repository.findById(nodeId);

    if (!record) {
      throw new AppError(`Knowledge graph node ${nodeId} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'GRAPH_NODE_NOT_FOUND',
      });
    }

    return { data: record };
  }

  async getNodeBySource(
    sourceTable: string,
    sourceRecordId: string,
    nodeLabel?: string,
  ): Promise<ServiceResult<GraphNodeRecord>> {
    const record = await this.repository.findNodeBySource(
      sourceTable.trim(),
      sourceRecordId.trim(),
      nodeLabel?.trim(),
    );

    if (!record) {
      throw new AppError('Knowledge graph node for the source reference was not found', {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'GRAPH_NODE_NOT_FOUND',
      });
    }

    return { data: record };
  }

  async searchNodes(input: GraphNodeListQuery): Promise<ServiceResult<GraphNodeRecord[]>> {
    const result = await this.repository.searchNodes(input);

    return {
      data: result.items,
      warnings:
        result.items.length === 0
          ? ['No knowledge graph nodes matched the selected filters.']
          : undefined,
      meta: result.meta,
    };
  }

  async getEdgeById(edgeId: bigint): Promise<ServiceResult<GraphEdgeRecord>> {
    const record = await this.repository.findEdgeById(edgeId);

    if (!record) {
      throw new AppError(`Knowledge graph edge ${edgeId} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'GRAPH_EDGE_NOT_FOUND',
      });
    }

    return { data: record };
  }

  async listEdges(input: GraphEdgeListQuery): Promise<ServiceResult<GraphEdgeRecord[]>> {
    const result = await this.repository.listEdges(input);

    return {
      data: result.items,
      warnings:
        result.items.length === 0
          ? ['No knowledge graph edges matched the selected filters.']
          : undefined,
      meta: result.meta,
    };
  }

  async getNeighbors(
    nodeId: bigint,
    input: GraphNeighborQuery = {},
  ): Promise<ServiceResult<GraphNeighborItem[]>> {
    await this.ensureNodeExists(nodeId);
    const items = await this.repository.listNeighbors(nodeId, input);

    return {
      data: items,
      warnings:
        items.length === 0
          ? ['No neighboring graph nodes were found for the selected node.']
          : undefined,
      meta: {
        nodeId: nodeId.toString(),
        direction: input.direction ?? 'both',
        relationshipType: input.relationshipType ?? null,
        totalRecords: items.length,
      },
    };
  }

  async getCaseGraph(
    caseMasterId: bigint,
    input: GetCaseGraphInput = {},
  ): Promise<ServiceResult<CaseGraphResult>> {
    const caseNode = await this.findCaseNode(caseMasterId);
    if (!caseNode) {
      return {
        data: {
          centerNode: null,
          nodes: [],
          edges: [],
        },
        warnings: ['No graph node is currently linked to the selected case.'],
        meta: {
          caseMasterId: caseMasterId.toString(),
          appliedDepth: 0,
        },
      };
    }

    const neighbors = await this.repository.listNeighbors(caseNode.id, {
      direction: 'both',
      minConfidenceScore: input.includeInferred ? undefined : 0.6,
      limit: 100,
    });

    return {
      data: {
        centerNode: caseNode,
        nodes: this.dedupeNodes([caseNode, ...neighbors.map((item) => item.node)]),
        edges: this.dedupeEdges(neighbors.map((item) => item.edge)),
      },
      warnings:
        input.depth && input.depth > 1
          ? ['Current graph expansion is limited to depth 1 in this phase.']
          : undefined,
      meta: {
        caseMasterId: caseMasterId.toString(),
        appliedDepth: 1,
        includeEvidence: input.includeEvidence ?? false,
        includeInferred: input.includeInferred ?? false,
      },
    };
  }

  async expandNode(
    nodeId: bigint,
    input: GraphNeighborQuery = {},
  ): Promise<ServiceResult<ExpandedGraphResult>> {
    const centerNode = await this.requireNode(nodeId);
    const neighbors = await this.repository.listNeighbors(nodeId, input);

    return {
      data: {
        centerNode,
        nodes: this.dedupeNodes([centerNode, ...neighbors.map((item) => item.node)]),
        edges: this.dedupeEdges(neighbors.map((item) => item.edge)),
      },
      warnings:
        neighbors.length === 0
          ? ['No graph expansion results were found for the selected node.']
          : undefined,
      meta: {
        nodeId: nodeId.toString(),
        direction: input.direction ?? 'both',
        relationshipType: input.relationshipType ?? null,
        totalEdges: neighbors.length,
      },
    };
  }

  private async ensureNodeExists(nodeId: bigint): Promise<void> {
    const record = await this.repository.findById(nodeId);

    if (!record) {
      throw new AppError(`Knowledge graph node ${nodeId} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'GRAPH_NODE_NOT_FOUND',
      });
    }
  }

  private async requireNode(nodeId: bigint): Promise<GraphNodeRecord> {
    const record = await this.repository.findById(nodeId);
    if (!record) {
      throw new AppError(`Knowledge graph node ${nodeId} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'GRAPH_NODE_NOT_FOUND',
      });
    }
    return record;
  }

  private async findCaseNode(caseMasterId: bigint): Promise<GraphNodeRecord | null> {
    const sourceRecordId = caseMasterId.toString();
    const candidates = [
      { sourceTable: 'case_master', nodeLabel: 'Case' },
      { sourceTable: 'case_master', nodeLabel: undefined },
      { sourceTable: 'case', nodeLabel: 'Case' },
      { sourceTable: 'case', nodeLabel: undefined },
    ];

    for (const candidate of candidates) {
      const match = await this.repository.findNodeBySource(
        candidate.sourceTable,
        sourceRecordId,
        candidate.nodeLabel,
      );
      if (match) return match;
    }

    for (const sourceTable of ['case_master', 'case']) {
      const search = await this.repository.searchNodes({
        page: 1,
        pageSize: 5,
        sourceTable,
        query: sourceRecordId,
      });
      const found = search.items.find((item) => item.sourceRecordId === sourceRecordId);
      if (found) return found;
    }

    return null;
  }

  private dedupeNodes(nodes: GraphNodeRecord[]): GraphNodeRecord[] {
    const map = new Map(nodes.map((node) => [node.id.toString(), node]));
    return [...map.values()];
  }

  private dedupeEdges(edges: GraphEdgeRecord[]): GraphEdgeRecord[] {
    const map = new Map(edges.map((edge) => [edge.id.toString(), edge]));
    return [...map.values()];
  }
}
