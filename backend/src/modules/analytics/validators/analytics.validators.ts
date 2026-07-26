import { z } from 'zod';

const numericString = z.string().regex(/^\d+$/, 'Must be a valid integer');
const booleanString = z.enum(['true', 'false']);

export const crimeStatisticsQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  reportYear: numericString.optional(),
  reportMonth: numericString.optional(),
  districtId: numericString.optional(),
  unitId: numericString.optional(),
  crimeHeadId: numericString.optional(),
  crimeSubHeadId: numericString.optional(),
  isProvisional: booleanString.optional(),
});

export const crimeReviewReportsQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  reportYear: numericString.optional(),
  reportMonth: numericString.optional(),
  isProvisional: booleanString.optional(),
  query: z.string().trim().min(1).optional(),
});

export const victimDemographicsQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  statisticYear: numericString.optional(),
  stateId: numericString.optional(),
  crimeContext: z.string().trim().min(1).optional(),
  purposeLabel: z.string().trim().min(1).optional(),
  genderLabel: z.string().trim().min(1).optional(),
  ageBandLabel: z.string().trim().min(1).optional(),
});

export const cyberSuspectQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  statisticYear: numericString.optional(),
  stateId: numericString.optional(),
  crimeHeadLabel: z.string().trim().min(1).optional(),
  suspectCategory: z.string().trim().min(1).optional(),
});

export const hotspotQuerySchema = z.object({
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

export const riskScoreQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  scoreSubjectType: z.string().trim().min(1).optional(),
  scoreType: z.string().trim().min(1).optional(),
  riskLevel: z.string().trim().min(1).optional(),
  reviewStatus: z.string().trim().min(1).optional(),
  caseMasterId: numericString.optional(),
  accusedMasterId: numericString.optional(),
  victimMasterId: numericString.optional(),
  hotspotId: numericString.optional(),
});

export const recommendationQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  recommendationType: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).optional(),
  priorityLevel: z.string().trim().min(1).optional(),
  caseMasterId: numericString.optional(),
  hotspotId: numericString.optional(),
  riskScoreId: numericString.optional(),
  minConfidenceScore: z.string().trim().min(1).optional(),
});

export const repeatOffenderQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  primaryDistrictId: numericString.optional(),
  riskLevel: z.string().trim().min(1).optional(),
  profileStatus: z.string().trim().min(1).optional(),
  query: z.string().trim().min(1).optional(),
});

export const analyticsForecastBodySchema = z.object({
  districtId: z.number().int().positive().optional(),
  unitId: z.number().int().positive().optional(),
  crimeHeadId: z.number().int().positive().optional(),
  forecastMonths: z.number().int().positive(),
  modelVersion: z.string().optional(),
});
