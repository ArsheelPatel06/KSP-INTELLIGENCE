import type { AiEvaluationFrameworkCapabilities } from './evaluation-framework.interface';
import type { AiEvaluationDatasetProfile, AiEvaluationDimension, AiEvaluationDimensionWeight } from './evaluation.types';
import { AI_EVALUATION_METRICS } from './evaluation-metrics';

export const AI_EVALUATION_DIMENSIONS: readonly AiEvaluationDimension[] = [
  'legal_accuracy',
  'retrieval_accuracy',
  'evidence_quality',
  'hallucination',
  'latency',
  'recommendation_accuracy',
  'graph_accuracy',
  'conversation_quality',
] as const;

export const AI_EVALUATION_FRAMEWORK_CAPABILITIES: AiEvaluationFrameworkCapabilities = {
  supportedDimensions: AI_EVALUATION_DIMENSIONS,
  supportsBenchmarkScorecards: true,
  supportsCrossAgentComparison: true,
  supportsGoldenSetEvaluation: true,
};

export const AI_EVALUATION_DATASET_PROFILES: readonly AiEvaluationDatasetProfile[] = [
  {
    name: 'legal-golden-set',
    description: 'Reviewed legal scenarios for benchmarking section suggestion and legal reasoning quality.',
    supportedDimensions: ['legal_accuracy', 'hallucination', 'conversation_quality'],
    sourceType: 'golden_set',
    expectedOwners: ['legal', 'supervisor'],
    benchmarkUseCases: [
      'act and section suggestion validation',
      'legal rationale review',
      'mandatory legal review trigger validation',
    ],
  },
  {
    name: 'retrieval-benchmark-set',
    description: 'Curated queries with expected evidence targets for evaluating retrieval precision and recall.',
    supportedDimensions: ['retrieval_accuracy', 'evidence_quality', 'latency'],
    sourceType: 'synthetic',
    expectedOwners: ['investigation', 'analytics', 'legal', 'graph'],
    benchmarkUseCases: [
      'RAG retrieval precision and recall',
      'citation relevance validation',
      'retrieval latency benchmarking',
    ],
  },
  {
    name: 'investigation-reviewed-cases',
    description: 'Historically reviewed or expert-annotated cases for evaluating recommendations and reasoning quality.',
    supportedDimensions: ['recommendation_accuracy', 'conversation_quality', 'evidence_quality'],
    sourceType: 'reviewed_case',
    expectedOwners: ['investigation', 'recommendation', 'supervisor'],
    benchmarkUseCases: [
      'investigation lead quality',
      'missing evidence recommendation quality',
      'case similarity recommendation alignment',
    ],
  },
  {
    name: 'graph-validation-set',
    description: 'Approved graph scenarios for validating path accuracy, link quality, and network explanations.',
    supportedDimensions: ['graph_accuracy', 'hallucination', 'conversation_quality'],
    sourceType: 'golden_set',
    expectedOwners: ['graph', 'recommendation', 'supervisor'],
    benchmarkUseCases: [
      'shortest path validation',
      'community detection validation',
      'centrality and connected-component explanation review',
    ],
  },
  {
    name: 'conversation-quality-set',
    description: 'Officer-facing prompts for validating clarity, follow-up questions, role scope, and escalation behavior.',
    supportedDimensions: ['conversation_quality', 'hallucination', 'latency'],
    sourceType: 'synthetic',
    expectedOwners: ['investigation', 'report', 'supervisor'],
    benchmarkUseCases: [
      'conversation task completion',
      'policy-compliant response style',
      'follow-up question relevance',
    ],
  },
] as const;

export const AI_EVALUATION_DEFAULT_DIMENSION_WEIGHTS: readonly AiEvaluationDimensionWeight[] = [
  { dimension: 'legal_accuracy', weight: 0.18 },
  { dimension: 'retrieval_accuracy', weight: 0.14 },
  { dimension: 'evidence_quality', weight: 0.18 },
  { dimension: 'hallucination', weight: 0.16 },
  { dimension: 'latency', weight: 0.08 },
  { dimension: 'recommendation_accuracy', weight: 0.12 },
  { dimension: 'graph_accuracy', weight: 0.08 },
  { dimension: 'conversation_quality', weight: 0.06 },
] as const;

export const AI_EVALUATION_SCORE_LABEL_THRESHOLDS = {
  poorMaximum: 0.49,
  fairMinimum: 0.5,
  goodMinimum: 0.75,
  excellentMinimum: 0.9,
} as const;

export const AI_EVALUATION_FRAMEWORK_DEFAULTS = {
  capabilities: AI_EVALUATION_FRAMEWORK_CAPABILITIES,
  metrics: AI_EVALUATION_METRICS,
  datasetProfiles: AI_EVALUATION_DATASET_PROFILES,
  dimensionWeights: AI_EVALUATION_DEFAULT_DIMENSION_WEIGHTS,
  scoreLabelThresholds: AI_EVALUATION_SCORE_LABEL_THRESHOLDS,
} as const;
