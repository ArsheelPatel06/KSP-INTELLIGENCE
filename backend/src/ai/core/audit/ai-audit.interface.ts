export interface AiAuditEvent {
  requestId: string;
  sessionId?: string;
  userId: string;
  eventType: string;
  modelProvider?: string;
  modelName?: string;
  agentNames?: string[];
  toolNames?: string[];
  confidenceScore?: number;
  humanReviewRequired?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Audit writer contract for the AI layer.
 *
 * The AI system must remain explainable and reviewable. This writer is designed
 * to capture orchestration decisions, provider usage, tool invocation lineage,
 * and human-review flags in later phases.
 */
export interface AiAuditWriter {
  write(event: AiAuditEvent): Promise<void>;
}
