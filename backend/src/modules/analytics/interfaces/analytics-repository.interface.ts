import type { PaginatedRepositoryResult } from '@core/interfaces/repository.interface';
import type {
  CrimeReviewReportListQuery,
  CrimeReviewReportRecord,
  CrimeStatisticAggregate,
  CrimeStatisticListQuery,
  CrimeStatisticRecord,
  CyberSuspectStatisticListQuery,
  CyberSuspectStatisticRecord,
  HotspotListQuery,
  HotspotRecord,
  RecommendationListQuery,
  RecommendationRecord,
  RepeatOffenderProfileListQuery,
  RepeatOffenderProfileRecord,
  RiskScoreListQuery,
  RiskScoreRecord,
  VictimDemographicListQuery,
  VictimDemographicRecord,
} from '../types/analytics.types';

export interface AnalyticsRepository {
  listCrimeStatistics(
    input: CrimeStatisticListQuery,
  ): Promise<PaginatedRepositoryResult<CrimeStatisticRecord>>;
  aggregateCrimeStatistics(input: CrimeStatisticListQuery): Promise<CrimeStatisticAggregate>;
  listCrimeReviewReports(
    input: CrimeReviewReportListQuery,
  ): Promise<PaginatedRepositoryResult<CrimeReviewReportRecord>>;
  listVictimDemographics(
    input: VictimDemographicListQuery,
  ): Promise<PaginatedRepositoryResult<VictimDemographicRecord>>;
  listCyberSuspectStatistics(
    input: CyberSuspectStatisticListQuery,
  ): Promise<PaginatedRepositoryResult<CyberSuspectStatisticRecord>>;
  listHotspots(input: HotspotListQuery): Promise<PaginatedRepositoryResult<HotspotRecord>>;
  findHotspotById(
    hotspotId: bigint,
  ): Promise<import('../types/analytics.types').HotspotDetailRecord | null>;
  listRiskScores(input: RiskScoreListQuery): Promise<PaginatedRepositoryResult<RiskScoreRecord>>;
  listRecommendations(
    input: RecommendationListQuery,
  ): Promise<PaginatedRepositoryResult<RecommendationRecord>>;
  findRecommendationById(recommendationId: bigint): Promise<RecommendationRecord | null>;
  listRepeatOffenderProfiles(
    input: RepeatOffenderProfileListQuery,
  ): Promise<PaginatedRepositoryResult<RepeatOffenderProfileRecord>>;
}
