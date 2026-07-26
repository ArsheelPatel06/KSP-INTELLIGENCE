import type { AiAgentName } from '../agents';
import type { AiEvaluationDimension, AiEvaluationMetricDefinition } from './evaluation.types';
import { AI_EVALUATION_METRICS } from './evaluation-metrics';

/**
 * Maps each AI agent to the evaluation dimensions that apply to its outputs.
 *
 * This mapping is the agent-evaluation routing table.
 * The evaluation selector uses this to determine what metrics to run
 * when scoring a given agent's output envelope.
 *
 * Architecture only — no runtime evaluation logic.
 */

export interface AiAgentEvaluationProfile {
  agent: AiAgentName;
  primaryDimensions: readonly AiEvaluationDimension[];
  secondaryDimensions: readonly AiEvaluationDimension[];
  description: string;
}

export const AI_AGENT_EVALUATION_PROFILES: readonly AiAgentEvaluationProfile[] = [
  {
    agent: 'investigation',
    primaryDimensions: ['retrieval_accuracy', 'evidence_quality', 'recommendation_accuracy'],
    secondaryDimensions: ['hallucination', 'latency', 'conversation_quality'],
    description:
      'Investigation Agent outputs are evaluated primarily on retrieval precision, evidence sufficiency, and recommendation alignment with reviewed cases.',
  },
  {
    agent: 'legal',
    primaryDimensions: ['legal_accuracy', 'evidence_quality', 'hallucination'],
    secondaryDimensions: ['retrieval_accuracy', 'latency', 'conversation_quality'],
    description:
      'Legal Agent outputs are evaluated primarily on section match rate, legal reasoning sufficiency, and hallucination prevention for legal claims.',
  },
  {
    agent: 'analytics',
    primaryDimensions: ['retrieval_accuracy', 'evidence_quality', 'latency'],
    secondaryDimensions: ['hallucination', 'conversation_quality'],
    description:
      'Analytics Agent outputs are evaluated primarily on retrieval accuracy of statistical sources, evidence chain completeness, and response latency.',
  },
  {
    agent: 'graph',
    primaryDimensions: ['graph_accuracy', 'hallucination', 'evidence_quality'],
    secondaryDimensions: ['latency', 'conversation_quality'],
    description:
      'Graph Agent outputs are evaluated primarily on link validation, path correctness, algorithm consistency, and hallucination of inferred relationships.',
  },
  {
    agent: 'recommendation',
    primaryDimensions: ['recommendation_accuracy', 'evidence_quality', 'hallucination'],
    secondaryDimensions: ['retrieval_accuracy', 'latency', 'conversation_quality'],
    description:
      'Recommendation Agent outputs are evaluated primarily on acceptance alignment, evidence coverage, priority calibration, and actionability.',
  },
  {
    agent: 'report',
    primaryDimensions: ['conversation_quality', 'evidence_quality', 'hallucination'],
    secondaryDimensions: ['retrieval_accuracy', 'latency'],
    description:
      'Report Agent outputs are evaluated primarily on clarity, evidence chain completeness, and absence of unsupported claims in generated reports.',
  },
  {
    agent: 'supervisor',
    primaryDimensions: ['recommendation_accuracy', 'conversation_quality', 'evidence_quality'],
    secondaryDimensions: ['hallucination', 'latency', 'retrieval_accuracy'],
    description:
      'Supervisor Agent outputs are evaluated primarily on recommendation relevance for operational decisions, clarity, and evidence backing.',
  },
] as const;

/**
 * Returns the full list of evaluation dimensions (primary + secondary)
 * that apply to a given agent.
 */
export function getAgentDimensions(agent: AiAgentName): readonly AiEvaluationDimension[] {
  const profile = AI_AGENT_EVALUATION_PROFILES.find((p) => p.agent === agent);
  if (!profile) return [];
  const combined = new Set<AiEvaluationDimension>([...profile.primaryDimensions, ...profile.secondaryDimensions]);
  return [...combined];
}

/**
 * Returns the metric definitions that are relevant to a given agent
 * based on its evaluation dimension mapping.
 */
export function getAgentMetrics(agent: AiAgentName): readonly AiEvaluationMetricDefinition[] {
  const dimensions = getAgentDimensions(agent);
  return AI_EVALUATION_METRICS.filter((m) => dimensions.includes(m.dimension));
}

/**
 * Dimension-to-agent reverse mapping.
 * Returns all agents that list the given dimension as primary or secondary.
 */
export function getAgentsForDimension(dimension: AiEvaluationDimension): readonly AiAgentName[] {
  return AI_AGENT_EVALUATION_PROFILES.filter(
    (p) => p.primaryDimensions.includes(dimension) || p.secondaryDimensions.includes(dimension),
  ).map((p) => p.agent);
}
