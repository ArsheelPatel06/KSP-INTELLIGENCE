export interface AiSourceReference {
  sourceType: string;
  sourceId: string;
  label: string;
  detail?: string;
  confidence?: number;
  reviewStatus?: string;
}

export interface AiWarning {
  code: string;
  message: string;
}

export interface AiExecutionMetrics {
  totalDurationMs: number;
  toolCallCount: number;
  providerCallCount: number;
  cacheHitCount: number;
}

/**
 * Phase 1 result envelope for internal AI execution.
 *
 * This is intentionally smaller than the final user-facing AI output contract.
 * Future phases will map this structure into the richer cross-agent response format.
 */
export interface AiExecutionResult<TData = unknown> {
  data: TData;
  warnings: AiWarning[];
  sources: AiSourceReference[];
  metrics?: AiExecutionMetrics;
}

export interface AiFollowUpQuestion {
  question: string;
  reason?: string;
}
