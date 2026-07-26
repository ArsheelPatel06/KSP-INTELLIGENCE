import type { AiLifecycleStage } from './ai-lifecycle';
import type { AiRequest } from '../shared/ai-request.types';
import type { AiWarning, AiSourceReference } from '../shared/ai-result.types';

export interface AiTaskPlan {
  requestedCapabilities: string[];
  selectedExecutionUnits: string[];
  executionMode: 'sequential' | 'parallel' | 'hybrid';
  requiresHumanReview: boolean;
}

export interface AiEvidenceBundle {
  facts: Record<string, unknown>[];
  citations: AiSourceReference[];
  warnings: AiWarning[];
}

/**
 * Shared mutable state that future orchestrators will pass through the AI
 * lifecycle. The design is intentionally explicit so each stage can add data
 * without losing traceability.
 */
export interface AiExecutionState {
  request: AiRequest;
  currentStage: AiLifecycleStage;
  intent?: string;
  entities?: Record<string, unknown>;
  permissionsValidated?: boolean;
  taskPlan?: AiTaskPlan;
  evidence?: AiEvidenceBundle;
  confidenceScore?: number;
  providerMetadata?: Record<string, unknown>;
  responsePayload?: Record<string, unknown>;
  failureReason?: string;
}
