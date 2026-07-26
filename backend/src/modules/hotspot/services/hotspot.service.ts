import { StatusCodes } from 'http-status-codes';
import type { ServiceResult } from '@core/interfaces/service.interface';
import { AppError } from '@core/exceptions/app-error';
import type { AnalyticsRepository } from '@modules/analytics/interfaces/analytics-repository.interface';
import type {
  HotspotDetailRecord,
  HotspotListQuery,
  HotspotRecord,
  RecommendationRecord,
} from '@modules/analytics/types/analytics.types';

export interface GenerateHotspotRecommendationInput {
  recommendationType?: string;
  includeContributingCases?: boolean;
}

export class HotspotService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async listHotspots(input: HotspotListQuery): Promise<ServiceResult<HotspotRecord[]>> {
    const result = await this.analyticsRepository.listHotspots(input);

    return {
      data: result.items,
      warnings:
        result.items.length === 0 ? ['No hotspots matched the selected filters.'] : undefined,
      meta: result.meta,
    };
  }

  async getHotspotById(hotspotId: bigint): Promise<ServiceResult<HotspotDetailRecord>> {
    const record = await this.analyticsRepository.findHotspotById(hotspotId);
    if (!record) {
      throw new AppError(`Hotspot ${hotspotId} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'HOTSPOT_NOT_FOUND',
      });
    }

    const warnings = new Set<string>();
    if (record.cases.length === 0)
      warnings.add('This hotspot currently has no contributing case links.');
    if (record.recommendations.length === 0)
      warnings.add('This hotspot has no stored recommendations yet.');

    return {
      data: record,
      warnings: warnings.size > 0 ? [...warnings] : undefined,
    };
  }

  async generateRecommendation(
    hotspotId: bigint,
    input: GenerateHotspotRecommendationInput,
  ): Promise<
    ServiceResult<
      | RecommendationRecord
      | {
          recommendationId: string | null;
          recommendationText: string;
          confidenceScore: number | null;
          priorityLevel: string;
          reviewRequired: boolean;
          rationale: string;
        }
    >
  > {
    const hotspot = await this.analyticsRepository.findHotspotById(hotspotId);
    if (!hotspot) {
      throw new AppError(`Hotspot ${hotspotId} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'HOTSPOT_NOT_FOUND',
      });
    }

    const existing = await this.analyticsRepository.listRecommendations({
      hotspotId,
      page: 1,
      pageSize: 1,
    });

    if (existing.items.length > 0) {
      const latestRecommendation = existing.items[0]!;
      return {
        data: latestRecommendation,
        warnings: ['Returning the latest stored hotspot recommendation.'],
      };
    }

    const patrolWindow = this.derivePatrolWindow(hotspot);
    const recommendationText =
      input.recommendationType?.toLowerCase() === 'patrol'
        ? `Increase patrol presence for hotspot ${hotspot.hotspotName ?? hotspot.id.toString()} during ${patrolWindow}.`
        : `Review hotspot ${hotspot.hotspotName ?? hotspot.id.toString()} for preventive deployment and focused investigation action.`;

    return {
      data: {
        recommendationId: null,
        recommendationText,
        confidenceScore: hotspot.confidenceScore ? Number(hotspot.confidenceScore) : null,
        priorityLevel: hotspot.riskLevel ?? 'Medium',
        reviewRequired: true,
        rationale:
          hotspot.cases.length > 0 && input.includeContributingCases
            ? `Based on ${hotspot.cases.length} contributing cases linked to this hotspot.`
            : 'Derived from hotspot risk level and confidence score.',
      },
      warnings: [
        'Recommendation preview generated heuristically because no stored recommendation exists yet.',
      ],
    };
  }

  private derivePatrolWindow(hotspot: HotspotDetailRecord): string {
    if (hotspot.timeWindowStart && hotspot.timeWindowEnd) {
      const from = hotspot.timeWindowStart.toISOString().slice(11, 16);
      const to = hotspot.timeWindowEnd.toISOString().slice(11, 16);
      return `${from}-${to}`;
    }

    return '21:00-02:00';
  }
}
