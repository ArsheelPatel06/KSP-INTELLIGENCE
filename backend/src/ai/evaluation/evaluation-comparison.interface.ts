import type { AiAgentName } from '../agents';
import type {
  AiEvaluationDimension,
  AiEvaluationLabel,
  AiEvaluationScorecard,
} from './evaluation.types';
import type { AiEvaluationRunResult, AiEvaluationRunSummary } from './evaluation-benchmark.types';

/**
 * Cross-agent and cross-run comparison contracts.
 *
 * These interfaces support comparing scorecards across agents,
 * across time (regression detection), and producing improvement/degradation signals.
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// Metric-Level Comparison
// ---------------------------------------------------------------------------

export type AiComparisonDirection = 'improved' | 'degraded' | 'unchanged' | 'new_metric' | 'removed_metric';

export interface AiMetricComparisonEntry {
  metricKey: string;
  dimension: AiEvaluationDimension;
  baselineScore: number;
  currentScore: number;
  delta: number;
  percentageChange: number;
  direction: AiComparisonDirection;
  baselineLabel?: AiEvaluationLabel;
  currentLabel?: AiEvaluationLabel;
  significanceNote?: string;
}

// ---------------------------------------------------------------------------
// Agent-Level Comparison
// ---------------------------------------------------------------------------

export interface AiAgentComparisonEntry {
  agent: AiAgentName;
  baselineOverallScore: number;
  currentOverallScore: number;
  baselineLabel: AiEvaluationLabel;
  currentLabel: AiEvaluationLabel;
  delta: number;
  direction: AiComparisonDirection;
  metricComparisons: readonly AiMetricComparisonEntry[];
  regressionCount: number;
  improvementCount: number;
}

// ---------------------------------------------------------------------------
// Cross-Agent Comparison (Same Run)
// ---------------------------------------------------------------------------

/**
 * Compares multiple agents within a single evaluation run.
 */
export interface AiCrossAgentComparison {
  runId: string;
  comparedAt: string;
  agents: readonly AiAgentComparisonSummary[];
  bestAgent: AiAgentName;
  worstAgent: AiAgentName;
  dimensionLeaders: ReadonlyArray<{
    dimension: AiEvaluationDimension;
    leadingAgent: AiAgentName;
    score: number;
  }>;
}

export interface AiAgentComparisonSummary {
  agent: AiAgentName;
  overallScore: number;
  overallLabel: AiEvaluationLabel;
  rank: number;
  strengthDimensions: readonly AiEvaluationDimension[];
  weaknessDimensions: readonly AiEvaluationDimension[];
  criticalFailures: number;
}

// ---------------------------------------------------------------------------
// Cross-Run Comparison (Regression Detection)
// ---------------------------------------------------------------------------

/**
 * Compares two evaluation runs to detect regressions and improvements.
 */
export interface AiCrossRunComparison {
  baselineRunId: string;
  currentRunId: string;
  comparedAt: string;
  overallBaselineScore: number;
  overallCurrentScore: number;
  overallDelta: number;
  overallDirection: AiComparisonDirection;
  agentComparisons: readonly AiAgentComparisonEntry[];
  totalRegressions: number;
  totalImprovements: number;
  criticalRegressions: readonly AiMetricComparisonEntry[];
}

// ---------------------------------------------------------------------------
// Comparison Thresholds
// ---------------------------------------------------------------------------

export interface AiComparisonThresholds {
  regressionThreshold: number;
  improvementThreshold: number;
  criticalRegressionThreshold: number;
  unchangedTolerance: number;
}

export const AI_DEFAULT_COMPARISON_THRESHOLDS: AiComparisonThresholds = {
  regressionThreshold: -0.05,
  improvementThreshold: 0.05,
  criticalRegressionThreshold: -0.15,
  unchangedTolerance: 0.02,
};

// ---------------------------------------------------------------------------
// Comparison Interfaces
// ---------------------------------------------------------------------------

/**
 * Interface for producing cross-agent and cross-run comparisons.
 * Architecture only — implementations are deferred to runtime phases.
 */
export interface AiEvaluationComparator {
  compareAgentsWithinRun(result: AiEvaluationRunResult): Promise<AiCrossAgentComparison>;

  compareRuns(
    baselineResult: AiEvaluationRunResult,
    currentResult: AiEvaluationRunResult,
    thresholds?: AiComparisonThresholds,
  ): Promise<AiCrossRunComparison>;

  compareScorecards(
    baseline: AiEvaluationScorecard,
    current: AiEvaluationScorecard,
  ): Promise<readonly AiMetricComparisonEntry[]>;
}

/**
 * Interface for trend tracking across multiple evaluation runs.
 * Architecture only — implementations are deferred to runtime phases.
 */
export interface AiEvaluationTrendTracker {
  getAgentTrend(
    agent: AiAgentName,
    runSummaries: readonly AiEvaluationRunSummary[],
  ): Promise<AiAgentTrendReport>;

  getDimensionTrend(
    dimension: AiEvaluationDimension,
    runSummaries: readonly AiEvaluationRunSummary[],
  ): Promise<AiDimensionTrendReport>;
}

export interface AiAgentTrendReport {
  agent: AiAgentName;
  dataPoints: ReadonlyArray<{
    runId: string;
    runDate: string;
    overallScore: number;
    overallLabel: AiEvaluationLabel;
  }>;
  trendDirection: AiComparisonDirection;
  averageScore: number;
}

export interface AiDimensionTrendReport {
  dimension: AiEvaluationDimension;
  dataPoints: ReadonlyArray<{
    runId: string;
    runDate: string;
    score: number;
    label: AiEvaluationLabel;
  }>;
  trendDirection: AiComparisonDirection;
  averageScore: number;
}
