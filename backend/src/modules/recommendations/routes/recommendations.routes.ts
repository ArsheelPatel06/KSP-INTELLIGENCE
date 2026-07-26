import { Router } from 'express';
import { PERMISSIONS } from '@core/auth/permissions';
import { asyncHandler } from '@core/response/async-handler';
import { validate } from '@core/validation/validate';
import { authenticateMiddleware } from '@middleware/authenticate.middleware';
import { requireAnyPermission, requirePermissions } from '@middleware/authorize.middleware';
import { notImplemented } from '@middleware/not-implemented.middleware';
import { recommendationController } from '../recommendations.container';
import { listRecommendationsQuerySchema, recommendationIdParamsSchema, reviewRecommendationBodySchema } from '../validators/recommendation.validators';

export const recommendationsRouter = Router();

const requireRecommendationRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ,
  PERMISSIONS.AI_USE,
);

recommendationsRouter.use(authenticateMiddleware, requireRecommendationRead);

recommendationsRouter.get('/', validate({ query: listRecommendationsQuerySchema }), asyncHandler(recommendationController.listRecommendations));
recommendationsRouter.get('/:recommendationId', validate({ params: recommendationIdParamsSchema }), asyncHandler(recommendationController.getRecommendationById));
recommendationsRouter.post('/:recommendationId/review', requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: recommendationIdParamsSchema, body: reviewRecommendationBodySchema }), notImplemented('Recommendation review workflow'));
