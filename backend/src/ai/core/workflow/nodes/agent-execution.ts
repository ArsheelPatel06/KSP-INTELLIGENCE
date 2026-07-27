import type { typeofAiGraphState } from '../state';
import { investigationTools, legalTools, analyticsTools, graphTools, recommendationTools } from '../../tools/registry';
import { executeAgentReactLoop } from './agent-react-loop';
import { promptManager } from '../../../prompts/prompt-manager';
export async function investigationAgentNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  return executeAgentReactLoop(
    'Investigation',
    promptManager.buildPrompt('investigation', { case_id: 'unknown', timeline_events: 'unknown', similar_case_summary: 'unknown' }),
    investigationTools,
    state
  );
}

export async function legalAgentNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  return executeAgentReactLoop(
    'Legal',
    promptManager.buildPrompt('legal', { legal_sources: 'unknown', narrative_summary: 'unknown', retrieved_sections: 'unknown' }),
    legalTools,
    state
  );
}

export async function graphAgentNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  return executeAgentReactLoop(
    'Graph',
    promptManager.buildPrompt('graph', { root_entity: 'unknown', subgraph_summary: 'unknown', path_explanation: 'unknown' }),
    graphTools,
    state
  );
}

export async function analyticsAgentNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  return executeAgentReactLoop(
    'Analytics',
    promptManager.buildPrompt('analytics', { metric_name: 'unknown', district_scope: 'unknown', time_window: 'unknown' }),
    analyticsTools,
    state
  );
}

export async function recommendationAgentNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  return executeAgentReactLoop(
    'Recommendation',
    promptManager.buildPrompt('recommendation', { recommendation_capabilities: 'unknown', validated_evidence: 'unknown', review_policy: 'unknown' }),
    recommendationTools,
    state
  );
}
