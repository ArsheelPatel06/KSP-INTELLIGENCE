import { z } from 'zod';

const numericString = z.string().regex(/^\d+$/, 'Must be a valid integer');

export const caseGraphParamsSchema = z.object({
  caseId: numericString,
});

export const graphNodeParamsSchema = z.object({
  nodeId: numericString,
});

export const caseGraphQuerySchema = z.object({
  depth: numericString.optional(),
  includeEvidence: z.enum(['true', 'false']).optional(),
  includeInferred: z.enum(['true', 'false']).optional(),
});

export const graphExpandQuerySchema = z.object({
  relationshipTypes: z.string().trim().min(1).optional(),
  depth: numericString.optional(),
  limit: numericString.optional(),
  minConfidence: z.string().trim().min(1).optional(),
});

export const graphPathBodySchema = z.object({
  fromNodeId: z.string().trim().min(1),
  toNodeId: z.string().trim().min(1),
  maxDepth: z.number().int().positive().optional(),
  minConfidence: z.number().min(0).max(1).optional(),
  includeInferred: z.boolean().optional(),
});

export const graphNetworkAnalysisBodySchema = z.object({
  seedNodeIds: z.array(z.string().trim().min(1)).min(1),
  algorithm: z.string().trim().min(1),
  depth: z.number().int().positive().optional(),
  filters: z
    .object({
      relationshipTypes: z.array(z.string()).optional(),
      minConfidence: z.number().min(0).max(1).optional(),
    })
    .optional(),
});
