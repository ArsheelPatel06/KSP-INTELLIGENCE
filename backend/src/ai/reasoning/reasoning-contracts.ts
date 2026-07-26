import type { AiReasoningPipelineDefinition } from './reasoning-engine.interface';

export const AI_REASONING_PIPELINE: AiReasoningPipelineDefinition = {
  stages: [
    'intent_detection',
    'entity_extraction',
    'context_collection',
    'database_retrieval',
    'graph_retrieval',
    'legal_retrieval',
    'analytics_retrieval',
    'evidence_validation',
    'recommendation_generation',
    'confidence_calculation',
    'response_formatting',
    'explainability',
    'hallucination_detection',
    'human_escalation',
  ],
  supportsParallelRetrieval: true,
  supportsHumanEscalation: true,
  requiresEvidenceValidation: true,
  blocksOnHallucinationRisk: true,
};

export const AI_REASONING_HUMAN_ESCALATION_TRIGGERS = [
  'LEGAL_SECTION_SUGGESTION',
  'RISK_SCORE_INTERPRETATION',
  'REPEAT_OFFENDER_LINKAGE',
  'GANG_INFERENCE',
  'HOTSPOT_OPERATIONAL_RECOMMENDATION',
  'EVIDENCE_GAP_ASSERTION',
  'HIGH_HALLUCINATION_RISK',
] as const;

export const AI_REASONING_HALLUCINATION_GUARDRAILS = [
  'No legal answer without legal retrieval.',
  'No graph conclusion without graph evidence.',
  'No analytics answer without analytics retrieval.',
  'No recommendation without supporting facts.',
  'No unsupported claim may pass response formatting.',
] as const;
