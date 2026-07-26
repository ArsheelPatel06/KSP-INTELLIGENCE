import type {
  GraphCentralityMeasure,
  GraphCentralityScore,
  GraphCommunity,
  GraphCommunityAlgorithm,
  GraphQuery,
  GraphSubgraph,
} from './graph.types';

export interface CommunityDetectionRequest extends GraphQuery {
  algorithm: GraphCommunityAlgorithm;
  minimumCommunitySize?: number;
}

export interface CentralityRequest extends GraphQuery {
  measure: GraphCentralityMeasure;
  topK?: number;
}

export interface ConnectedComponentsRequest extends GraphQuery {
  minimumComponentSize?: number;
}

export interface ConnectedComponent {
  componentId: string;
  nodeCount: number;
  edgeCount: number;
  subgraph: GraphSubgraph;
}

export interface GraphAlgorithmEngine {
  detectCommunities(request: CommunityDetectionRequest): Promise<GraphCommunity[]>;
  calculateCentrality(request: CentralityRequest): Promise<GraphCentralityScore[]>;
  connectedComponents(request: ConnectedComponentsRequest): Promise<ConnectedComponent[]>;
}
