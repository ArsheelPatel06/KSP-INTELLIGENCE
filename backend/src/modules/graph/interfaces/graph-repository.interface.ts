import type { BaseRepository, PaginatedRepositoryResult } from '@core/interfaces/repository.interface';
import type {
  GraphEdgeListQuery,
  GraphEdgeRecord,
  GraphNeighborItem,
  GraphNeighborQuery,
  GraphNodeListQuery,
  GraphNodeRecord,
} from '../types/graph.types';

export interface GraphRepository extends BaseRepository<GraphNodeRecord, bigint> {
  findNodeBySource(sourceTable: string, sourceRecordId: string, nodeLabel?: string): Promise<GraphNodeRecord | null>;
  searchNodes(input: GraphNodeListQuery): Promise<PaginatedRepositoryResult<GraphNodeRecord>>;
  findEdgeById(id: bigint): Promise<GraphEdgeRecord | null>;
  listEdges(input: GraphEdgeListQuery): Promise<PaginatedRepositoryResult<GraphEdgeRecord>>;
  listOutgoingEdges(nodeId: bigint, input?: Omit<GraphEdgeListQuery, 'fromKgNodeId'>): Promise<PaginatedRepositoryResult<GraphEdgeRecord>>;
  listIncomingEdges(nodeId: bigint, input?: Omit<GraphEdgeListQuery, 'toKgNodeId'>): Promise<PaginatedRepositoryResult<GraphEdgeRecord>>;
  listNeighbors(nodeId: bigint, input?: GraphNeighborQuery): Promise<GraphNeighborItem[]>;
}
