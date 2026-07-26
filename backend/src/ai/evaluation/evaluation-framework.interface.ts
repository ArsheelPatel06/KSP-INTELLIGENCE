import type { AiAgentOutputEnvelope } from '../shared/ai-output-contract.types';
import type {
  AiConversationQualityEvaluator,
  AiEvaluationReporter,
  AiEvaluationSelector,
  AiEvidenceQualityEvaluator,
  AiGraphAccuracyEvaluator,
  AiHallucinationEvaluator,
  AiLatencyEvaluator,
  AiLegalAccuracyEvaluator,
  AiRecommendationAccuracyEvaluator,
  AiRetrievalAccuracyEvaluator,
} from './evaluation-components.interface';
import type {
  AiEvaluationCaseReference,
  AiEvaluationDatasetProfile,
  AiEvaluationDimension,
  AiEvaluationMetricDefinition,
  AiEvaluationScorecard,
} from './evaluation.types';

export interface AiEvaluationFrameworkCapabilities {
  supportedDimensions: readonly AiEvaluationDimension[];
  supportsBenchmarkScorecards: boolean;
  supportsCrossAgentComparison: boolean;
  supportsGoldenSetEvaluation: boolean;
}

export interface AiEvaluationFrameworkDependencies {
  legalAccuracyEvaluator: AiLegalAccuracyEvaluator;
  retrievalAccuracyEvaluator: AiRetrievalAccuracyEvaluator;
  evidenceQualityEvaluator: AiEvidenceQualityEvaluator;
  hallucinationEvaluator: AiHallucinationEvaluator;
  latencyEvaluator: AiLatencyEvaluator;
  recommendationAccuracyEvaluator: AiRecommendationAccuracyEvaluator;
  graphAccuracyEvaluator: AiGraphAccuracyEvaluator;
  conversationQualityEvaluator: AiConversationQualityEvaluator;
  reporter: AiEvaluationReporter;
  selector: AiEvaluationSelector;
}

export interface AiEvaluationFramework {
  readonly capabilities: AiEvaluationFrameworkCapabilities;
  readonly metricDefinitions: readonly AiEvaluationMetricDefinition[];
  readonly datasetProfiles: readonly AiEvaluationDatasetProfile[];
  readonly dependencies: AiEvaluationFrameworkDependencies;

  evaluate(output: AiAgentOutputEnvelope, benchmark: AiEvaluationCaseReference): Promise<AiEvaluationScorecard>;
}
