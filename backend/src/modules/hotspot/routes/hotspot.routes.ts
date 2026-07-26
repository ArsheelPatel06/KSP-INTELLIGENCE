import { Router } from 'express';
import { PERMISSIONS } from '@core/auth/permissions';
import { asyncHandler } from '@core/response/async-handler';
import { validate } from '@core/validation/validate';
import { authenticateMiddleware } from '@middleware/authenticate.middleware';
import { requireAnyPermission, requirePermissions } from '@middleware/authorize.middleware';
import { hotspotController } from '../hotspot.container';
import {
  generateHotspotRecommendationBodySchema,
  hotspotIdParamsSchema,
  listHotspotsQuerySchema,
} from '../validators/hotspot.validators';

export const hotspotRouter = Router();

const requireHotspotRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ,
);

hotspotRouter.use(authenticateMiddleware, requireHotspotRead);

hotspotRouter.get('/', validate({ query: listHotspotsQuerySchema }), asyncHandler(hotspotController.listHotspots));
hotspotRouter.get('/:hotspotId', validate({ params: hotspotIdParamsSchema }), asyncHandler(hotspotController.getHotspotById));
hotspotRouter.post('/:hotspotId/recommendations', requirePermissions(PERMISSIONS.AI_USE), validate({ params: hotspotIdParamsSchema, body: generateHotspotRecommendationBodySchema }), asyncHandler(hotspotController.generateRecommendation));
