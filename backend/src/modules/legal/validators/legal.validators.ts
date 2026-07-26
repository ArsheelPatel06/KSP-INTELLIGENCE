import { z } from 'zod';

const numericString = z.string().regex(/^\d+$/, 'Must be a valid integer');
const booleanString = z.enum(['true', 'false']);

export const actCodeParamsSchema = z.object({
  actCode: z.string().trim().min(1),
});

export const sectionParamsSchema = z.object({
  actCode: z.string().trim().min(1),
  sectionCode: z.string().trim().min(1),
});

export const sectionCodeOnlyParamsSchema = z.object({
  sectionCode: z.string().trim().min(1),
});

export const crimeHeadIdParamsSchema = z.object({
  crimeHeadId: numericString,
});

export const listActsQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  active: booleanString.optional(),
  query: z.string().trim().min(1).optional(),
});

export const listSectionsQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  actCode: z.string().trim().min(1).optional(),
  active: booleanString.optional(),
  query: z.string().trim().min(1).optional(),
});

export const listLegalDocumentsQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  actCode: z.string().trim().min(1).optional(),
  query: z.string().trim().min(1).optional(),
});

export const listIpcReferencesQuerySchema = z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  actCode: z.string().trim().min(1).optional(),
  sectionCode: z.string().trim().min(1).optional(),
  query: z.string().trim().min(1).optional(),
});

export const ipcSearchQuerySchema = z.object({
  q: z.string().trim().min(1),
  actCode: z.string().trim().min(1).optional(),
  limit: numericString.optional(),
});

export const ipcSectionDetailQuerySchema = z.object({
  actCode: z.string().trim().min(1).optional(),
});

export const ipcRecommendBodySchema = z.object({
  caseMasterId: z.number().int().positive().optional(),
  narrative: z.string().trim().min(1),
  crimeHeadId: z.number().int().positive().optional(),
  includeSimilarCases: z.boolean().optional(),
});
