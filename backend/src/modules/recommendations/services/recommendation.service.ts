import { StatusCodes } from 'http-status-codes';
import type { ServiceResult } from '@core/interfaces/service.interface';
import { AppError } from '@core/exceptions/app-error';
import type { AnalyticsRepository } from '@modules/analytics/interfaces/analytics-repository.interface';
import type {
  RecommendationListQuery,
  RecommendationRecord,
  RiskScoreRecord,
} from '@modules/analytics/types/analytics.types';

export class RecommendationService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async listRecommendations(
    input: RecommendationListQuery,
  ): Promise<ServiceResult<RecommendationRecord[]>> {
    const result = await this.analyticsRepository.listRecommendations(input);

    return {
      data: result.items,
      warnings: this.buildRecommendationWarnings(result.items),
      meta: result.meta,
    };
  }

  async getRecommendationById(
    recommendationId: bigint,
  ): Promise<ServiceResult<RecommendationRecord>> {
    const record = await this.analyticsRepository.findRecommendationById(recommendationId);
    if (!record) {
      throw new AppError(`Recommendation ${recommendationId} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'RECOMMENDATION_NOT_FOUND',
      });
    }

    return {
      data: record,
      warnings: this.buildRecommendationWarnings([record]),
    };
  }

  async getCaseRecommendations(
    caseMasterId: bigint,
    limit = 10,
  ): Promise<ServiceResult<RecommendationRecord[]>> {
    const result = await this.analyticsRepository.listRecommendations({
      caseMasterId,
      page: 1,
      pageSize: limit,
    });

    return {
      data: result.items,
      warnings:
        result.items.length === 0
          ? ['No recommendations are available for the selected case.']
          : this.buildRecommendationWarnings(result.items),
      meta: {
        ...result.meta,
        caseMasterId: caseMasterId.toString(),
      },
    };
  }

  async getRecommendationsForRiskScore(
    riskScoreId: bigint,
    limit = 10,
  ): Promise<ServiceResult<RecommendationRecord[]>> {
    const result = await this.analyticsRepository.listRecommendations({
      riskScoreId,
      page: 1,
      pageSize: limit,
    });

    return {
      data: result.items,
      warnings:
        result.items.length === 0
          ? ['No recommendations are linked to the selected risk score.']
          : this.buildRecommendationWarnings(result.items),
      meta: {
        ...result.meta,
        riskScoreId: riskScoreId.toString(),
      },
    };
  }

  async getHighPriorityRiskScores(limit = 10): Promise<ServiceResult<RiskScoreRecord[]>> {
    const result = await this.analyticsRepository.listRiskScores({
      page: 1,
      pageSize: limit,
      reviewStatus: 'pending',
    });

    const ranked = [...result.items].sort((left, right) => {
      const leftScore = left.scoreValue ? Number(left.scoreValue) : -1;
      const rightScore = right.scoreValue ? Number(right.scoreValue) : -1;
      return rightScore - leftScore;
    });

    return {
      data: ranked,
      warnings: ranked.length === 0 ? ['No pending risk scores are available.'] : undefined,
      meta: {
        ...result.meta,
        ranking: 'scoreValueDesc',
      },
    };
  }

  private buildRecommendationWarnings(items: RecommendationRecord[]): string[] | undefined {
    const warnings = new Set<string>();

    if (items.some((item) => item.confidenceScore == null)) {
      warnings.add('Some recommendations are missing confidence scores.');
    }

    if (items.some((item) => item.legalSections.length === 0)) {
      warnings.add('Some recommendations do not include linked legal sections.');
    }

    return warnings.size > 0 ? [...warnings] : undefined;
  }
}
