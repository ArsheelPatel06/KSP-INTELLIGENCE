import type { AiRequest } from '../shared/ai-request.types';
import type { AiReasoningExecutionResult, AiReasoningStage, AiReasoningState } from './reasoning.types';
import type {
  AiAnalyticsRetriever,
  AiConfidenceCalculator,
  AiContextCollector,
  AiDatabaseRetriever,
  AiEntityExtractor,
  AiEvidenceValidator,
  AiExplainabilityEngine,
  AiGraphRetriever,
  AiHallucinationDetector,
  AiHumanEscalationEngine,
  AiIntentDetector,
  AiLegalRetriever,
  AiRecommendationGenerator,
  AiResponseFormatter,
} from './reasoning-stage-components.interface';

export interface AiReasoningPipelineDefinition {
  stages: readonly AiReasoningStage[];
  supportsParallelRetrieval: boolean;
  supportsHumanEscalation: boolean;
  requiresEvidenceValidation: boolean;
  blocksOnHallucinationRisk: boolean;
}

export interface AiReasoningEngineDependencies {
  intentDetector: AiIntentDetector;
  entityExtractor: AiEntityExtractor;
  contextCollector: AiContextCollector;
  databaseRetriever: AiDatabaseRetriever;
  graphRetriever: AiGraphRetriever;
  legalRetriever: AiLegalRetriever;
  analyticsRetriever: AiAnalyticsRetriever;
  evidenceValidator: AiEvidenceValidator;
  recommendationGenerator: AiRecommendationGenerator;
  confidenceCalculator: AiConfidenceCalculator;
  responseFormatter: AiResponseFormatter;
  explainabilityEngine: AiExplainabilityEngine;
  hallucinationDetector: AiHallucinationDetector;
  humanEscalationEngine: AiHumanEscalationEngine;
}

export interface AiReasoningEngine {
  readonly pipeline: AiReasoningPipelineDefinition;
  readonly dependencies: AiReasoningEngineDependencies;

  initialize(request: AiRequest): AiReasoningState;
  execute(request: AiRequest): Promise<AiReasoningExecutionResult>;
}
