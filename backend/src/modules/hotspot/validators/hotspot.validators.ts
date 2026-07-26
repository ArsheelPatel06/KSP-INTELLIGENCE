import { z } from 'zod';

const numericString = z.string().regex(/^\d+$/, 'Must be a valid integer');

export const hotspotIdParamsSchema = z.object({
  hotspotId: numericString,
});

export const listHotspotsQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  districtId: numericString.optional(),
  unitId: numericString.optional(),
  crimeHeadId: numericString.optional(),
  crimeSubHeadId: numericString.optional(),
  riskLevel: z.string().trim().min(1).optional(),
  trendDirection: z.string().trim().min(1).optional(),
  minConfidenceScore: z.string().trim().min(1).optional(),
});

export const generateHotspotRecommendationBodySchema = z.object({
  recommendationType: z.string().trim().min(1).optional(),
  includeContributingCases: z.boolean().optional(),
});
