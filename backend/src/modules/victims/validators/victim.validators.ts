import { z } from 'zod';

const numericString = z.string().regex(/^\d+$/, 'Must be a valid integer');
const booleanString = z.enum(['true', 'false']);

export const victimIdParamsSchema = z.object({
  victimId: numericString,
});

export const caseIdParamsSchema = z.object({
  caseId: numericString,
});

export const listVictimsQuerySchema = z
  .object({
    page: numericString.optional(),
    pageSize: numericString.optional(),
    caseMasterId: numericString.optional(),
    genderId: numericString.optional(),
    victimPolice: booleanString.optional(),
    districtId: numericString.optional(),
    minAge: numericString.optional(),
    maxAge: numericString.optional(),
    query: z.string().trim().min(1).optional(),
  })
  .passthrough();

export const victimRiskScoresQuerySchema = z
  .object({
    limit: numericString.optional(),
  })
  .passthrough();

export const addVictimBodySchema = z.object({
  victimNameHash: z.string().optional(),
  ageYear: z.number().int().nonnegative().optional(),
  genderId: z.number().int().positive().optional(),
  victimPolice: z.boolean().optional(),
});
