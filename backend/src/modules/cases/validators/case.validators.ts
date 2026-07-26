import { z } from 'zod';

const numericString = z.string().regex(/^\d+$/, 'Must be a valid integer');
const isoDateString = z.string().datetime({ offset: true }).or(z.string().date());

export const caseIdParamsSchema = z.object({
  caseId: numericString,
});

export const crimeNoParamsSchema = z.object({
  crimeNo: z.string().trim().min(1),
});

export const caseNoParamsSchema = z.object({
  caseNo: z.string().trim().min(1),
});

export const listCasesQuerySchema = z
  .object({
    page: numericString.optional(),
    pageSize: numericString.optional(),
    crimeNo: z.string().trim().min(1).optional(),
    caseNo: z.string().trim().min(1).optional(),
    policeStationId: numericString.optional(),
    policePersonId: numericString.optional(),
    caseStatusId: numericString.optional(),
    crimeMajorHeadId: numericString.optional(),
    crimeMinorHeadId: numericString.optional(),
    districtId: numericString.optional(),
    fromCrimeRegisteredDate: isoDateString.optional(),
    toCrimeRegisteredDate: isoDateString.optional(),
    query: z.string().trim().min(1).optional(),
  })
  .passthrough();

export const similarCasesQuerySchema = z
  .object({
    limit: numericString.optional(),
  })
  .passthrough();

export const createCaseBodySchema = z.object({
  crimeRegisteredDate: z.string().min(1),
  policeStationId: z.number().int().positive(),
  caseCategoryId: z.number().int().positive().optional(),
  gravityOffenceId: z.number().int().positive().optional(),
  crimeMajorHeadId: z.number().int().positive().optional(),
  crimeMinorHeadId: z.number().int().positive().optional(),
  incidentFromDate: z.string().optional(),
  incidentToDate: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  briefFacts: z.string().optional(),
  complainants: z.array(z.record(z.unknown())).optional(),
  victims: z.array(z.record(z.unknown())).optional(),
  accused: z.array(z.record(z.unknown())).optional(),
  actSections: z.array(z.record(z.unknown())).optional(),
});

export const updateCaseBodySchema = z.object({
  caseStatusId: z.number().int().positive().optional(),
  briefFacts: z.string().optional(),
  crimeMajorHeadId: z.number().int().positive().optional(),
  crimeMinorHeadId: z.number().int().positive().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const validateCaseBodySchema = z.object({
  validationMode: z.string().optional(),
  includeLegalReview: z.boolean().optional(),
  includeEvidenceCheck: z.boolean().optional(),
});

export const addDiaryEntryBodySchema = z.object({
  entryDateTime: z.string().optional(),
  entryType: z.string().optional(),
  entryText: z.string().min(1),
  actionTaken: z.string().optional(),
  nextAction: z.string().optional(),
});

export const assignCaseBodySchema = z.object({
  employeeId: z.number().int().positive(),
  notes: z.string().optional(),
  priorityLevel: z.string().optional(),
});

export const generateCaseRecommendationBodySchema = z.object({
  recommendationTypes: z.array(z.string()).optional(),
  includeGraph: z.boolean().optional(),
  includeSimilarCases: z.boolean().optional(),
});
