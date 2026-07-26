import type { AiAgentOutputEnvelope } from '../shared/ai-output-contract.types';
import type {
  AiEvaluationCaseReference,
  AiEvaluationDimension,
  AiEvaluationMetricResult,
  AiEvaluationScorecard,
} from './evaluation.types';

export interface AiLegalAccuracyEvaluator {
  evaluate(output: AiAgentOutputEnvelope, benchmark: AiEvaluationCaseReference): Promise<AiEvaluationMetricResult[]>;
}

export interface AiRetrievalAccuracyEvaluator {
  evaluate(output: AiAgentOutputEnvelope, benchmark: AiEvaluationCaseReference): Promise<AiEvaluationMetricResult[]>;
}

export interface AiEvidenceQualityEvaluator {
  evaluate(output: AiAgentOutputEnvelope, benchmark: AiEvaluationCaseReference): Promise<AiEvaluationMetricResult[]>;
}

export interface AiHallucinationEvaluator {
  evaluate(output: AiAgentOutputEnvelope, benchmark: AiEvaluationCaseReference): Promise<AiEvaluationMetricResult[]>;
}

export interface AiLatencyEvaluator {
  evaluate(output: AiAgentOutputEnvelope, benchmark: AiEvaluationCaseReference): Promise<AiEvaluationMetricResult[]>;
}

export interface AiRecommendationAccuracyEvaluator {
  evaluate(output: AiAgentOutputEnvelope, benchmark: AiEvaluationCaseReference): Promise<AiEvaluationMetricResult[]>;
}

export interface AiGraphAccuracyEvaluator {
  evaluate(output: AiAgentOutputEnvelope, benchmark: AiEvaluationCaseReference): Promise<AiEvaluationMetricResult[]>;
}

export interface AiConversationQualityEvaluator {
  evaluate(output: AiAgentOutputEnvelope, benchmark: AiEvaluationCaseReference): Promise<AiEvaluationMetricResult[]>;
}

export interface AiEvaluationReporter {
  buildScorecard(
    benchmark: AiEvaluationCaseReference,
    output: AiAgentOutputEnvelope,
    metrics: AiEvaluationMetricResult[],
  ): Promise<AiEvaluationScorecard>;
}

export interface AiEvaluationSelector {
  dimensionsForAgent(agent: string): Promise<AiEvaluationDimension[]>;
}
