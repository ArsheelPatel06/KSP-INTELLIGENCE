import type { AiRequestContext } from '../shared/ai-request.types';
import type { AiSourceReference, AiWarning } from '../shared/ai-result.types';

export type GraphNodeType =
  | 'CASE'
  | 'COMPLAINANT'
  | 'VICTIM'
  | 'ACCUSED'
  | 'WITNESS'
  | 'OFFICER'
  | 'UNIT'
  | 'DISTRICT'
  | 'STATE'
  | 'COURT'
  | 'ACT'
  | 'SECTION'
  | 'CRIME_HEAD'
  | 'CRIME_SUB_HEAD'
  | 'OCCURRENCE'
  | 'EVIDENCE'
  | 'VEHICLE'
  | 'PHONE_DIGITAL_IDENTIFIER'
  | 'FINANCIAL_ACCOUNT'
  | 'FINANCIAL_TRANSACTION'
  | 'WEAPON'
  | 'FORENSIC_REPORT'
  | 'HOTSPOT'
  | 'CRIME_STATISTIC'
  | 'CRIME_REVIEW_REPORT'
  | 'REPORT_SECTION'
  | 'GANG_NETWORK'
  | 'REPEAT_OFFENDER_PROFILE'
  | 'MODUS_OPERANDI'
  | 'SOCIAL_RELATIONSHIP'
  | 'ADDRESS_HISTORY'
  | 'ORGANIZATION'
  | 'RISK_SCORE'
  | 'RECOMMENDATION'
  | 'CASE_SIMILARITY'
  | 'ALERT'
  | 'TASK'
  | 'CHAT_SESSION'
  | 'CHAT_MESSAGE'
  | 'SEARCH_REQUEST'
  | 'DATA_SOURCE'
  | 'DATA_QUALITY_ISSUE'
  | 'DOCUMENT_ATTACHMENT'
  | 'MODEL_AUDIT_LOG'
  | 'FEATURE_VECTOR';

export type GraphEdgeType =
  | 'HAS_COMPLAINANT'
  | 'HAS_VICTIM'
  | 'HAS_ACCUSED'
  | 'HAS_WITNESS'
  | 'REGISTERED_BY'
  | 'REGISTERED_AT'
  | 'HAS_OCCURRENCE'
  | 'HAS_STATUS'
  | 'HAS_MAJOR_HEAD'
  | 'HAS_MINOR_HEAD'
  | 'INVOKES_ACT'
  | 'INVOKES_LEGAL_SECTION'
  | 'HEARD_IN'
  | 'BELONGS_TO_DISTRICT'
  | 'BELONGS_TO_STATE'
  | 'ASSIGNED_TO_UNIT'
  | 'POSTED_IN_DISTRICT'
  | 'HAS_RANK'
  | 'HAS_DESIGNATION'
  | 'HAS_SECTION'
  | 'HAS_SUB_HEAD'
  | 'HAS_EVIDENCE'
  | 'COLLECTED_BY'
  | 'INVOLVES_VEHICLE'
  | 'VEHICLE_OWNED_BY_ACCUSED'
  | 'VEHICLE_OWNED_BY_VICTIM'
  | 'USES_PHONE_OR_DIGITAL_ID'
  | 'LINKED_TO_ACCUSED'
  | 'LINKED_TO_VICTIM'
  | 'LINKED_TO_COMPLAINANT'
  | 'HAS_FINANCIAL_ACCOUNT'
  | 'HAS_TRANSACTION'
  | 'FROM_ACCOUNT'
  | 'TO_ACCOUNT'
  | 'USED_WEAPON'
  | 'HAS_FORENSIC_REPORT'
  | 'HAS_DIARY_ENTRY'
  | 'DIARY_WRITTEN_BY'
  | 'CONTRIBUTES_TO_HOTSPOT'
  | 'HOTSPOT_IN_DISTRICT'
  | 'HOTSPOT_OWNED_BY_UNIT'
  | 'STATISTIC_FOR_DISTRICT'
  | 'STATISTIC_FOR_UNIT'
  | 'STATISTIC_FOR_CRIME_HEAD'
  | 'REPORT_HAS_SECTION'
  | 'SECTION_DISCUSS_CRIME_HEAD'
  | 'DERIVED_FROM_SOURCE'
  | 'HAS_MEMBER'
  | 'MEMBER_IS_ACCUSED'
  | 'MEMBER_IS_OFFENDER_PROFILE'
  | 'OPERATES_IN_DISTRICT'
  | 'ASSOCIATED_WITH_UNIT'
  | 'ASSOCIATED_WITH_CRIME_HEAD'
  | 'RESOLVES_TO_PROFILE'
  | 'PROFILE_LINKED_TO_CASE'
  | 'HAS_MODUS_OPERANDI'
  | 'HAS_SOCIAL_RELATIONSHIP'
  | 'SUPPORTED_BY_EVIDENCE'
  | 'HAS_ADDRESS_HISTORY'
  | 'INVOLVES_ORGANIZATION'
  | 'HAS_RISK_SCORE'
  | 'GENERATES_RECOMMENDATION'
  | 'SIMILAR_TO_CASE'
  | 'TRIGGERS_ALERT'
  | 'CREATES_TASK'
  | 'HAS_CHAT_MESSAGE'
  | 'REFERENCES_SEARCH_REQUEST'
  | 'AUDITED_BY_MODEL_RUN';

export type GraphAlgorithmName =
  | 'shortest_path'
  | 'k_hop_search'
  | 'community_detection'
  | 'centrality'
  | 'connected_components'
  | 'relationship_expansion'
  | 'graph_summarization'
  | 'graph_explanation';

export type GraphCentralityMeasure = 'degree' | 'betweenness' | 'closeness' | 'eigenvector' | 'pagerank';
export type GraphCommunityAlgorithm = 'louvain' | 'label_propagation' | 'leiden' | 'weakly_connected_components';

export interface GraphNode {
  nodeType: GraphNodeType;
  nodeId: string;
  label: string;
  properties: Record<string, unknown>;
  confidence?: number;
  reviewStatus?: string;
  sourceReferences?: AiSourceReference[];
}

export interface GraphEdge {
  edgeType: GraphEdgeType;
  fromNodeId: string;
  fromNodeType: GraphNodeType;
  toNodeId: string;
  toNodeType: GraphNodeType;
  properties: Record<string, unknown>;
  confidence?: number;
  reviewStatus?: string;
  sourceReferences?: AiSourceReference[];
}

export interface GraphSubgraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  warnings?: AiWarning[];
}

export interface GraphQueryScope {
  districtIds?: readonly number[];
  unitIds?: readonly number[];
  caseMasterIds?: readonly bigint[];
  allowedNodeTypes?: readonly GraphNodeType[];
  allowedEdgeTypes?: readonly GraphEdgeType[];
  maxDepth?: number;
}

export interface GraphQuery {
  context: AiRequestContext;
  rootNodeType?: GraphNodeType;
  rootNodeId?: string;
  targetNodeType?: GraphNodeType;
  targetNodeId?: string;
  scope?: GraphQueryScope;
}

export interface GraphPathStep {
  node: GraphNode;
  incomingEdge?: GraphEdge;
}

export interface GraphPath {
  steps: GraphPathStep[];
  hopCount: number;
  totalConfidence?: number;
  explanation?: string[];
}

export interface GraphExpansionResult {
  root: GraphNode;
  subgraph: GraphSubgraph;
  expansionSummary: string[];
}

export interface GraphCentralityScore {
  nodeId: string;
  nodeType: GraphNodeType;
  measure: GraphCentralityMeasure;
  score: number;
  rank?: number;
}

export interface GraphCommunity {
  communityId: string;
  algorithm: GraphCommunityAlgorithm;
  nodes: Array<Pick<GraphNode, 'nodeId' | 'nodeType' | 'label'>>;
  summary?: string;
}

export interface GraphSummary {
  title: string;
  keyFindings: string[];
  importantNodes: GraphNode[];
  importantEdges: GraphEdge[];
  warnings: AiWarning[];
}

export interface GraphExplanation {
  explanationType: 'path' | 'community' | 'centrality' | 'relationship' | 'summary';
  narrative: string;
  evidence: AiSourceReference[];
  confidence?: number;
  caveats?: string[];
}
