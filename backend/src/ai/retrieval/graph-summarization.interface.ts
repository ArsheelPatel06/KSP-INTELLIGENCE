import type { GraphExplanation, GraphPath, GraphQuery, GraphSubgraph, GraphSummary } from './graph.types';

export interface GraphSummarizationRequest extends GraphQuery {
  subgraph: GraphSubgraph;
  summaryMode?: 'investigation' | 'supervisor' | 'analytics' | 'relationship';
}

export interface GraphExplanationRequest extends GraphQuery {
  subgraph?: GraphSubgraph;
  path?: GraphPath;
  explanationMode?: 'path' | 'community' | 'centrality' | 'relationship' | 'summary';
}

export interface GraphSummarizer {
  summarize(request: GraphSummarizationRequest): Promise<GraphSummary>;
  explain(request: GraphExplanationRequest): Promise<GraphExplanation>;
}
