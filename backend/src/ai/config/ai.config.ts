import { env } from '@config/env';

/**
 * Central AI configuration for KSP Intelligence OS.
 *
 * Phase 1 keeps configuration deterministic and environment-light on purpose.
 * The backend already exposes a provider selector through `env.AI_PROVIDER`.
 * Additional AI-specific knobs are defined here so future phases can evolve
 * without leaking configuration concerns into controllers, services, or tools.
 */
export const aiConfig = {
  provider: env.AI_PROVIDER,
  architectureVersion: 'phase-1-foundation',
  lifecycle: {
    defaultRequestTimeoutMs: 15_000,
    maxOrchestratorSteps: 12,
    maxParallelExecutions: 5,
    requireAuditLog: true,
  },
  rateLimit: {
    maxRequestsPerMinutePerUser: 30,
    maxRequestsPerMinutePerCase: 60,
    maxConcurrentSessionsPerUser: 5,
  },
  cache: {
    enabled: true,
    defaultTtlSeconds: 300,
    evidenceBundleTtlSeconds: 120,
    analyticsSnapshotTtlSeconds: 600,
  },
  audit: {
    enabled: true,
    includeToolCalls: true,
    includeProviderMetadata: true,
    includeWarnings: true,
  },
  promptManagement: {
    enabled: true,
    versioningRequired: true,
    allowRuntimeOverrides: false,
  },
  output: {
    requireConfidence: true,
    requireExplainability: true,
    requireWarningsArray: true,
    requireHumanReviewFlagForSensitiveOutputs: true,
  },
} as const;

export type AiConfig = typeof aiConfig;
