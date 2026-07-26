import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { recommendationService } from '../../../modules/recommendations/recommendations.container';

export const GetCaseRecommendationsTool = new DynamicStructuredTool({
  name: 'get_case_recommendations',
  description: 'Retrieves AI-generated investigation recommendations for a specific case, including next steps, missing evidence, and priority levels.',
  schema: z.object({
    caseMasterId: z.string().describe('The ID of the case (caseMasterId).'),
  }),
  func: async ({ caseMasterId }) => {
    try {
      const result = await recommendationService.getCaseRecommendations(BigInt(caseMasterId));
      return JSON.stringify(result.data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
    } catch (error) {
      return `Failed to fetch case recommendations: ${(error as Error).message}`;
    }
  },
});

export const SearchRecommendationsTool = new DynamicStructuredTool({
  name: 'search_recommendations',
  description: 'Search across all recommendations. Useful for finding patterns, identifying similar recommended actions, or retrieving officer assignments.',
  schema: z.object({
    recommendationType: z.string().optional().describe('Filter by recommendation type (e.g. "NEXT_STEP", "MISSING_EVIDENCE", "OFFICER_ASSIGNMENT").'),
    priorityLevel: z.string().optional().describe('Filter by priority level (e.g. "HIGH", "CRITICAL").'),
    status: z.string().optional().describe('Filter by status (e.g. "PENDING", "ACCEPTED").'),
  }),
  func: async ({ recommendationType, priorityLevel, status }) => {
    try {
      const result = await recommendationService.listRecommendations({
        recommendationType,
        priorityLevel,
        status,
        page: 1,
        pageSize: 10,
      });
      return JSON.stringify(result.data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
    } catch (error) {
      return `Failed to search recommendations: ${(error as Error).message}`;
    }
  },
});

export const GetHighPriorityRiskScoresTool = new DynamicStructuredTool({
  name: 'get_high_priority_risk_scores',
  description: 'Retrieves a ranked list of the highest priority risk scores that require immediate attention from investigators.',
  schema: z.object({}),
  func: async () => {
    try {
      const result = await recommendationService.getHighPriorityRiskScores();
      return JSON.stringify(result.data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
    } catch (error) {
      return `Failed to fetch risk scores: ${(error as Error).message}`;
    }
  },
});
