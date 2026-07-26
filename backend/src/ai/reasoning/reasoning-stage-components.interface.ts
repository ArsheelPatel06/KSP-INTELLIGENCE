import type { AiDetectedIntent, AiExtractedEntity } from '../pipelines';
import type { AiReasoningState } from './reasoning.types';
import type {
  AiAnalyticsRetrievalResult,
  AiConfidenceCalculationResult,
  AiDatabaseRetrievalResult,
  AiEvidenceValidationResult,
  AiExplainabilityResult,
  AiGraphRetrievalResult,
  AiHallucinationDetectionResult,
  AiHumanEscalationDecision,
  AiLegalRetrievalResult,
  AiReasoningContextCollection,
  AiReasoningResponse,
  AiRecommendationGenerationResult,
} from './reasoning.types';

export interface AiIntentDetector {
  detect(state: AiReasoningState): Promise<AiDetectedIntent>;
}

export interface AiEntityExtractor {
  extract(state: AiReasoningState): Promise<AiExtractedEntity[]>;
}

export interface AiContextCollector {
  collect(state: AiReasoningState): Promise<AiReasoningContextCollection>;
}

export interface AiDatabaseRetriever {
  retrieve(state: AiReasoningState): Promise<AiDatabaseRetrievalResult>;
}

export interface AiGraphRetriever {
  retrieve(state: AiReasoningState): Promise<AiGraphRetrievalResult>;
}

export interface AiLegalRetriever {
  retrieve(state: AiReasoningState): Promise<AiLegalRetrievalResult>;
}

export interface AiAnalyticsRetriever {
  retrieve(state: AiReasoningState): Promise<AiAnalyticsRetrievalResult>;
}

export interface AiEvidenceValidator {
  validate(state: AiReasoningState): Promise<AiEvidenceValidationResult>;
}

export interface AiRecommendationGenerator {
  generate(state: AiReasoningState): Promise<AiRecommendationGenerationResult>;
}

export interface AiConfidenceCalculator {
  calculate(state: AiReasoningState): Promise<AiConfidenceCalculationResult>;
}

export interface AiResponseFormatter {
  format(state: AiReasoningState): Promise<AiReasoningResponse>;
}

export interface AiExplainabilityEngine {
  explain(state: AiReasoningState): Promise<AiExplainabilityResult>;
}

export interface AiHallucinationDetector {
  assess(state: AiReasoningState): Promise<AiHallucinationDetectionResult>;
}

export interface AiHumanEscalationEngine {
  decide(state: AiReasoningState): Promise<AiHumanEscalationDecision>;
}
