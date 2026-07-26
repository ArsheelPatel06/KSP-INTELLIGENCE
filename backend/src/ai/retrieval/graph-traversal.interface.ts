import type {
  GraphExpansionResult,
  GraphNodeType,
  GraphPath,
  GraphQuery,
  GraphSubgraph,
} from './graph.types';

export interface ShortestPathRequest extends GraphQuery {
  rootNodeType: GraphNodeType;
  rootNodeId: string;
  targetNodeType: GraphNodeType;
  targetNodeId: string;
  maxDepth?: number;
}

export interface KHopSearchRequest extends GraphQuery {
  rootNodeType: GraphNodeType;
  rootNodeId: string;
  hops: number;
  includeEdgeTypes?: string[];
  includeNodeTypes?: GraphNodeType[];
}

export interface RelationshipExpansionRequest extends GraphQuery {
  rootNodeType: GraphNodeType;
  rootNodeId: string;
  expansionDepth: number;
  prioritizeNodeTypes?: GraphNodeType[];
}

export interface GraphTraversalEngine {
  shortestPath(request: ShortestPathRequest): Promise<GraphPath | null>;
  kHopSearch(request: KHopSearchRequest): Promise<GraphSubgraph>;
  expandRelationships(request: RelationshipExpansionRequest): Promise<GraphExpansionResult>;
}
