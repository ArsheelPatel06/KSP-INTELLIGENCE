import type { GraphAlgorithmEngine } from './graph-algorithms.interface';
import type { GraphSummarizer } from './graph-summarization.interface';
import type { GraphTraversalEngine } from './graph-traversal.interface';
import type {
  GraphAlgorithmName,
  GraphCommunity,
  GraphExplanation,
  GraphExpansionResult,
  GraphNode,
  GraphNodeType,
  GraphPath,
  GraphQuery,
  GraphSubgraph,
  GraphSummary,
} from './graph.types';
import type { GraphCentralityScore } from './graph.types';

export interface KnowledgeGraphLayerCapabilities {
  nodeTypes: readonly GraphNodeType[];
  supportsTraversal: boolean;
  supportsShortestPath: boolean;
  supportsKHopSearch: boolean;
  supportsCommunityDetection: boolean;
  supportsCentrality: boolean;
  supportsRelationshipExpansion: boolean;
  supportsSummarization: boolean;
  supportsExplanation: boolean;
  supportedAlgorithms: readonly GraphAlgorithmName[];
}

export interface KnowledgeGraphLayer {
  readonly capabilities: KnowledgeGraphLayerCapabilities;
  readonly traversal: GraphTraversalEngine;
  readonly algorithms: GraphAlgorithmEngine;
  readonly summarizer: GraphSummarizer;

  getNode(query: GraphQuery & { rootNodeType: GraphNodeType; rootNodeId: string }): Promise<GraphNode | null>;
  shortestPath(query: GraphQuery & { rootNodeType: GraphNodeType; rootNodeId: string; targetNodeType: GraphNodeType; targetNodeId: string }): Promise<GraphPath | null>;
  kHopSearch(query: GraphQuery & { rootNodeType: GraphNodeType; rootNodeId: string; hops: number }): Promise<GraphSubgraph>;
  relationshipExpansion(query: GraphQuery & { rootNodeType: GraphNodeType; rootNodeId: string; expansionDepth: number }): Promise<GraphExpansionResult>;
  detectCommunities(query: GraphQuery & { algorithm: 'louvain' | 'label_propagation' | 'leiden' | 'weakly_connected_components' }): Promise<GraphCommunity[]>;
  centrality(query: GraphQuery & { measure: 'degree' | 'betweenness' | 'closeness' | 'eigenvector' | 'pagerank'; topK?: number }): Promise<GraphCentralityScore[]>;
  summarize(query: GraphQuery & { subgraph: GraphSubgraph }): Promise<GraphSummary>;
  explain(query: GraphQuery & { subgraph?: GraphSubgraph; path?: GraphPath }): Promise<GraphExplanation>;
}
