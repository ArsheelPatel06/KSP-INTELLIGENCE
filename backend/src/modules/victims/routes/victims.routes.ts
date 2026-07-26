import { Router } from 'express';
import { PERMISSIONS } from '@core/auth/permissions';
import { asyncHandler } from '@core/response/async-handler';
import { validate } from '@core/validation/validate';
import { authenticateMiddleware } from '@middleware/authenticate.middleware';
import { requireAnyPermission } from '@middleware/authorize.middleware';
import { victimController } from '../victims.container';
import {
  listVictimsQuerySchema,
  victimIdParamsSchema,
  victimRiskScoresQuerySchema,
} from '../validators/victim.validators';

export const victimsRouter = Router();

const requireCaseRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
);

victimsRouter.use(authenticateMiddleware, requireCaseRead);

victimsRouter.get('/', validate({ query: listVictimsQuerySchema }), asyncHandler(victimController.listVictims));
victimsRouter.get('/:victimId', validate({ params: victimIdParamsSchema }), asyncHandler(victimController.getVictimById));
victimsRouter.get('/:victimId/risk-scores', validate({ params: victimIdParamsSchema, query: victimRiskScoresQuerySchema }), asyncHandler(victimController.getVictimRiskScores));
