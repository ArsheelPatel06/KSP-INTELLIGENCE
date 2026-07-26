import type { AiAgentName } from '../agents';
import type {
  AiEvaluationCaseReference,
  AiEvaluationDatasetProfile,
  AiEvaluationDimension,
  AiEvaluationLabel,
  AiEvaluationScorecard,
} from './evaluation.types';

/**
 * Benchmark scenario template types and batch evaluation run contracts.
 *
 * These types define the shape of benchmark scenario factories,
 * evaluation suite configurations, and run-level aggregation results.
 *
 * Architecture only — no runtime evaluation logic.
 */

// ---------------------------------------------------------------------------
// Benchmark Scenario Templates
// ---------------------------------------------------------------------------

/**
 * Base scenario template that all dimension-specific templates extend.
 * A scenario template is a factory input for generating benchmark cases.
 */
export interface AiBenchmarkScenarioBase {
  templateId: string;
  dimension: AiEvaluationDimension;
  scenarioName: string;
  description: string;
  tags: readonly string[];
  agent?: AiAgentName;
  datasetProfile?: string;
}

export interface AiLegalBenchmarkScenario extends AiBenchmarkScenarioBase {
  dimension: 'legal_accuracy';
  inputNarrative: string;
  expectedActCodes: readonly string[];
  expectedSectionCodes: readonly string[];
  reviewTriggerExpected: boolean;
  jurisdictionContext?: string;
}

export interface AiRetrievalBenchmarkScenario extends AiBenchmarkScenarioBase {
  dimension: 'retrieval_accuracy';
  queryText: string;
  expectedSourceIds: readonly string[];
  expectedCollections: readonly string[];
  minExpectedResults: number;
}

export interface AiEvidenceBenchmarkScenario extends AiBenchmarkScenarioBase {
  dimension: 'evidence_quality';
  queryText: string;
  expectedCitationCount: number;
  expectedProvenanceChainLength: number;
  conflictingEvidencePresent: boolean;
}

export interface AiHallucinationBenchmarkScenario extends AiBenchmarkScenarioBase {
  dimension: 'hallucination';
  queryText: string;
  knownFactCount: number;
  expectedUnsupportedClaimCount: number;
  contradictionInjected: boolean;
}

export interface AiLatencyBenchmarkScenario extends AiBenchmarkScenarioBase {
  dimension: 'latency';
  queryText: string;
  expectedEndToEndMs: number;
  expectedRetrievalMs: number;
  expectedGraphMs?: number;
  expectedFirstTokenMs?: number;
}

export interface AiRecommendationBenchmarkScenario extends AiBenchmarkScenarioBase {
  dimension: 'recommendation_accuracy';
  caseContext: string;
  expectedCapabilities: readonly string[];
  expectedPriorityLevel: string;
  expectedActionCount: number;
}

export interface AiGraphBenchmarkScenario extends AiBenchmarkScenarioBase {
  dimension: 'graph_accuracy';
  seedNodeIds: readonly string[];
  expectedPathLength?: number;
  expectedCommunityCount?: number;
  expectedAlgorithm?: 'shortest_path' | 'community_detection' | 'centrality' | 'connected_components';
}

export interface AiConversationBenchmarkScenario extends AiBenchmarkScenarioBase {
  dimension: 'conversation_quality';
  userPrompt: string;
  expectedTopicsCovered: readonly string[];
  forbiddenContent?: readonly string[];
  expectedFollowUpCount: number;
  policyComplianceRequired: boolean;
}

export type AiBenchmarkScenario =
  | AiLegalBenchmarkScenario
  | AiRetrievalBenchmarkScenario
  | AiEvidenceBenchmarkScenario
  | AiHallucinationBenchmarkScenario
  | AiLatencyBenchmarkScenario
  | AiRecommendationBenchmarkScenario
  | AiGraphBenchmarkScenario
  | AiConversationBenchmarkScenario;

// ---------------------------------------------------------------------------
// Evaluation Suite / Batch Run Contracts
// ---------------------------------------------------------------------------

/**
 * An evaluation suite groups benchmark scenarios for a coordinated run.
 */
export interface AiEvaluationSuiteDefinition {
  suiteId: string;
  name: string;
  description: string;
  datasetProfiles: readonly AiEvaluationDatasetProfile[];
  benchmarks: readonly AiEvaluationCaseReference[];
  targetAgents: readonly AiAgentName[];
  targetDimensions: readonly AiEvaluationDimension[];
  createdAt: string;
  createdBy: string;
}

/**
 * Request to execute an evaluation run over a suite of benchmarks.
 */
export interface AiEvaluationRunRequest {
  runId: string;
  suiteId: string;
  triggeredBy: string;
  triggeredAt: string;
  reason: string;
  targetAgents?: readonly AiAgentName[];
  targetDimensions?: readonly AiEvaluationDimension[];
  maxConcurrentBenchmarks?: number;
}

/**
 * Status tracking for a running or completed evaluation run.
 */
export type AiEvaluationRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Per-agent aggregate scores within a run.
 */
export interface AiEvaluationAgentRunSummary {
  agent: AiAgentName;
  benchmarkCount: number;
  overallScore: number;
  overallLabel: AiEvaluationLabel;
  dimensionScores: ReadonlyArray<{
    dimension: AiEvaluationDimension;
    score: number;
    label: AiEvaluationLabel;
    metricCount: number;
  }>;
  passRate: number;
  criticalFailures: number;
}

/**
 * Full result of a completed evaluation run.
 */
export interface AiEvaluationRunResult {
  runId: string;
  suiteId: string;
  status: AiEvaluationRunStatus;
  startedAt: string;
  completedAt?: string;
  scorecards: readonly AiEvaluationScorecard[];
  agentSummaries: readonly AiEvaluationAgentRunSummary[];
  overallScore: number;
  overallLabel: AiEvaluationLabel;
  totalBenchmarks: number;
  passedBenchmarks: number;
  failedBenchmarks: number;
  criticalFailures: number;
  warnings: readonly string[];
}

/**
 * Compact summary of an evaluation run for listing and dashboards.
 */
export interface AiEvaluationRunSummary {
  runId: string;
  suiteId: string;
  suiteName: string;
  status: AiEvaluationRunStatus;
  triggeredBy: string;
  triggeredAt: string;
  completedAt?: string;
  overallScore: number;
  overallLabel: AiEvaluationLabel;
  totalBenchmarks: number;
  passRate: number;
  criticalFailures: number;
  regressions: number;
  improvements: number;
}

/**
 * Interface for the batch evaluation runner.
 * Architecture only — implementations are deferred to runtime phases.
 */
export interface AiEvaluationRunner {
  executeSuite(request: AiEvaluationRunRequest): Promise<AiEvaluationRunResult>;
  getRunStatus(runId: string): Promise<AiEvaluationRunSummary>;
  listRuns(suiteId?: string): Promise<readonly AiEvaluationRunSummary[]>;
  cancelRun(runId: string): Promise<void>;
}
