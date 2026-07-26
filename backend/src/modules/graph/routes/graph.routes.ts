import { Router } from 'express';
import { PERMISSIONS } from '@core/auth/permissions';
import { asyncHandler } from '@core/response/async-handler';
import { validate } from '@core/validation/validate';
import { authenticateMiddleware } from '@middleware/authenticate.middleware';
import { requireAnyPermission, requirePermissions } from '@middleware/authorize.middleware';
import { graphController } from '../graph.container';
import {
  caseGraphParamsSchema,
  caseGraphQuerySchema,
  graphExpandQuerySchema,
  graphNetworkAnalysisBodySchema,
  graphNodeParamsSchema,
  graphPathBodySchema,
} from '../validators/graph.validators';

export const graphRouter = Router();

const requireGraphRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ,
  PERMISSIONS.AI_USE,
);

graphRouter.use(authenticateMiddleware, requireGraphRead);

graphRouter.get('/cases/:caseId', validate({ params: caseGraphParamsSchema, query: caseGraphQuerySchema }), asyncHandler(graphController.getCaseGraph));
graphRouter.get('/nodes/:nodeId/expand', validate({ params: graphNodeParamsSchema, query: graphExpandQuerySchema }), asyncHandler(graphController.expandNode));
graphRouter.post('/path', requirePermissions(PERMISSIONS.AI_USE), validate({ body: graphPathBodySchema }), asyncHandler(graphController.findShortestPath));
graphRouter.post('/network-analysis', requireAnyPermission(PERMISSIONS.ANALYTICS_READ, PERMISSIONS.AI_USE), validate({ body: graphNetworkAnalysisBodySchema }), asyncHandler(graphController.runNetworkAnalysis));
