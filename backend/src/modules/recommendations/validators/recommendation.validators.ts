import { z } from 'zod';

const numericString = z.string().regex(/^\d+$/, 'Must be a valid integer');

export const recommendationIdParamsSchema = z.object({
  recommendationId: numericString,
});

export const listRecommendationsQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  recommendationType: z.string().trim().min(1).optional(),
  type: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).optional(),
  priorityLevel: z.string().trim().min(1).optional(),
  caseMasterId: numericString.optional(),
  hotspotId: numericString.optional(),
  riskScoreId: numericString.optional(),
  minConfidenceScore: z.string().trim().min(1).optional(),
});

export const reviewRecommendationBodySchema = z.object({
  decision: z.string().trim().min(1),
  reviewNotes: z.string().optional(),
  createTask: z.boolean().optional(),
});
