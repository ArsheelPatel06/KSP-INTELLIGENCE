import type { AiLayerName } from './ai-layers';

export interface AiDependencyEdge {
  from: AiLayerName;
  to: AiLayerName;
  reason: string;
}

/**
 * Formal dependency map for the AI foundation.
 *
 * This is useful for architectural validation, documentation generation,
 * onboarding, and future safeguards that prevent circular coupling.
 */
export const AI_DEPENDENCY_MAP: readonly AiDependencyEdge[] = [
  {
    from: 'entry',
    to: 'orchestration',
    reason: 'Normalized requests feed orchestration.',
  },
  {
    from: 'orchestration',
    to: 'domain_execution',
    reason: 'Planning and routing drive future domain execution modules.',
  },
  {
    from: 'domain_execution',
    to: 'retrieval',
    reason: 'Execution units will invoke tools and retrievers.',
  },
  {
    from: 'retrieval',
    to: 'evidence',
    reason: 'Retrieved facts become evidence bundles.',
  },
  {
    from: 'evidence',
    to: 'confidence',
    reason: 'Confidence depends on the evidence bundle.',
  },
  {
    from: 'confidence',
    to: 'provider',
    reason: 'Provider synthesis should receive curated, scored context.',
  },
  {
    from: 'entry',
    to: 'governance',
    reason: 'Governance starts as soon as a request enters the AI layer.',
  },
  {
    from: 'orchestration',
    to: 'governance',
    reason: 'Governance must observe task-planning and routing decisions.',
  },
  {
    from: 'provider',
    to: 'governance',
    reason: 'Provider calls must be auditable and rate-limited.',
  },
] as const;
