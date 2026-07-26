import type { ServiceResult } from '@core/interfaces/service.interface';
import type { AnalyticsRepository } from '../interfaces/analytics-repository.interface';
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

export class AnalyticsService {
  constructor(private readonly repository: AnalyticsRepository) {}

  async listCrimeStatistics(input: CrimeStatisticListQuery): Promise<ServiceResult<CrimeStatisticRecord[]>> {
    const [result, aggregate] = await Promise.all([
      this.repository.listCrimeStatistics(input),
      this.repository.aggregateCrimeStatistics(input),
    ]);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No crime statistics matched the selected filters.'] : undefined,
      meta: {
        ...result.meta,
        aggregate,
      },
    };
  }

  async getCrimeStatisticAggregate(input: CrimeStatisticListQuery): Promise<ServiceResult<CrimeStatisticAggregate>> {
    const aggregate = await this.repository.aggregateCrimeStatistics(input);
    return { data: aggregate };
  }

  async listCrimeReviewReports(input: CrimeReviewReportListQuery): Promise<ServiceResult<CrimeReviewReportRecord[]>> {
    const result = await this.repository.listCrimeReviewReports(input);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No crime review reports matched the selected filters.'] : undefined,
      meta: result.meta,
    };
  }

  async listVictimDemographics(input: VictimDemographicListQuery): Promise<ServiceResult<VictimDemographicRecord[]>> {
    const result = await this.repository.listVictimDemographics(input);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No victim demographic statistics matched the selected filters.'] : undefined,
      meta: result.meta,
    };
  }

  async listCyberSuspectStatistics(input: CyberSuspectStatisticListQuery): Promise<ServiceResult<CyberSuspectStatisticRecord[]>> {
    const result = await this.repository.listCyberSuspectStatistics(input);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No cyber suspect statistics matched the selected filters.'] : undefined,
      meta: result.meta,
    };
  }

  async listHotspots(input: HotspotListQuery): Promise<ServiceResult<HotspotRecord[]>> {
    const result = await this.repository.listHotspots(input);
    const warnings = new Set<string>();

    if (result.items.length === 0) {
      warnings.add('No hotspots matched the selected filters.');
    }

    if (result.items.some((item) => !item.centerLatitude || !item.centerLongitude)) {
      warnings.add('Some hotspots are missing center coordinates.');
    }

    return {
      data: result.items,
      warnings: warnings.size > 0 ? [...warnings] : undefined,
      meta: result.meta,
    };
  }

  async listRiskScores(input: RiskScoreListQuery): Promise<ServiceResult<RiskScoreRecord[]>> {
    const result = await this.repository.listRiskScores(input);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No risk scores matched the selected filters.'] : undefined,
      meta: result.meta,
    };
  }

  async listRecommendations(input: RecommendationListQuery): Promise<ServiceResult<RecommendationRecord[]>> {
    const result = await this.repository.listRecommendations(input);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No recommendations matched the selected filters.'] : undefined,
      meta: result.meta,
    };
  }

  async listRepeatOffenderProfiles(input: RepeatOffenderProfileListQuery): Promise<ServiceResult<RepeatOffenderProfileRecord[]>> {
    const result = await this.repository.listRepeatOffenderProfiles(input);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No repeat offender profiles matched the selected filters.'] : undefined,
      meta: result.meta,
    };
  }
}
