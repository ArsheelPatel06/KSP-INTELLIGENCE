export type AiLifecycleStage =
  | 'request_accepted'
  | 'context_prepared'
  | 'permissions_validated'
  | 'task_planned'
  | 'execution_routed'
  | 'evidence_aggregated'
  | 'confidence_computed'
  | 'provider_synthesized'
  | 'response_formatted'
  | 'audited'
  | 'completed'
  | 'failed';

/**
 * Ordered lifecycle stages for every AI request.
 *
 * Future observability, tracing, metrics, and audit writers should use these
 * exact stage names to make AI execution timelines consistent across modules.
 */
export const AI_LIFECYCLE_STAGES: readonly AiLifecycleStage[] = [
  'request_accepted',
  'context_prepared',
  'permissions_validated',
  'task_planned',
  'execution_routed',
  'evidence_aggregated',
  'confidence_computed',
  'provider_synthesized',
  'response_formatted',
  'audited',
  'completed',
  'failed',
] as const;
