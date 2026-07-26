import { z } from 'zod';

const numericString = z.string().regex(/^\d+$/, 'Must be a valid integer');
const isoDateString = z.string().datetime({ offset: true }).or(z.string().date());

export const chatSessionParamsSchema = z.object({
  chatSessionId: numericString,
});

export const createChatSessionBodySchema = z.object({
  caseMasterId: z.number().int().positive().optional(),
  sessionPurpose: z.string().trim().min(1),
  securityClassification: z.string().trim().min(1).optional(),
});

export const sendChatMessageBodySchema = z.object({
  messageText: z.string().trim().min(1),
  includeEvidence: z.boolean().optional(),
  includeGraph: z.boolean().optional(),
  includeLegal: z.boolean().optional(),
  includeAnalytics: z.boolean().optional(),
});

export const listChatSessionsQuerySchema = z.object({
  caseMasterId: numericString.optional(),
  employeeId: numericString.optional(),
  fromDate: isoDateString.optional(),
  toDate: isoDateString.optional(),
  page: numericString.optional(),
  pageSize: numericString.optional(),
});
