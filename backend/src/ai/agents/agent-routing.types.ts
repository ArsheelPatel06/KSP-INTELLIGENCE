import type { AiAgentName } from './agent.types';

export type AiAgentRoutingIntent =
  | 'case_query'
  | 'legal_query'
  | 'analytics_query'
  | 'relationship_query'
  | 'recommendation_query'
  | 'report_query'
  | 'supervisor_query';

export interface AiAgentRoutingRule {
  intent: AiAgentRoutingIntent;
  primaryAgent: AiAgentName;
  supportingAgents: readonly AiAgentName[];
  executionMode: 'sequential' | 'parallel' | 'hybrid';
  requiresEvidenceAggregation: boolean;
  notes?: readonly string[];
}

export const AI_AGENT_ROUTING_RULES: readonly AiAgentRoutingRule[] = [
  {
    intent: 'case_query',
    primaryAgent: 'investigation',
    supportingAgents: ['graph', 'recommendation'],
    executionMode: 'hybrid',
    requiresEvidenceAggregation: true,
  },
  {
    intent: 'legal_query',
    primaryAgent: 'legal',
    supportingAgents: ['investigation', 'recommendation'],
    executionMode: 'hybrid',
    requiresEvidenceAggregation: true,
  },
  {
    intent: 'analytics_query',
    primaryAgent: 'analytics',
    supportingAgents: ['supervisor'],
    executionMode: 'parallel',
    requiresEvidenceAggregation: true,
  },
  {
    intent: 'relationship_query',
    primaryAgent: 'graph',
    supportingAgents: ['investigation', 'recommendation'],
    executionMode: 'hybrid',
    requiresEvidenceAggregation: true,
  },
  {
    intent: 'recommendation_query',
    primaryAgent: 'recommendation',
    supportingAgents: ['investigation', 'legal', 'graph', 'analytics'],
    executionMode: 'hybrid',
    requiresEvidenceAggregation: true,
  },
  {
    intent: 'report_query',
    primaryAgent: 'report',
    supportingAgents: ['investigation', 'analytics', 'legal'],
    executionMode: 'sequential',
    requiresEvidenceAggregation: true,
  },
  {
    intent: 'supervisor_query',
    primaryAgent: 'supervisor',
    supportingAgents: ['analytics', 'recommendation', 'report'],
    executionMode: 'hybrid',
    requiresEvidenceAggregation: true,
  },
] as const;
