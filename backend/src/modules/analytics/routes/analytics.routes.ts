import { Router } from 'express';
import { PERMISSIONS } from '@core/auth/permissions';
import { asyncHandler } from '@core/response/async-handler';
import { validate } from '@core/validation/validate';
import { authenticateMiddleware } from '@middleware/authenticate.middleware';
import { requirePermissions } from '@middleware/authorize.middleware';
import { notImplemented } from '@middleware/not-implemented.middleware';
import { analyticsController } from '../analytics.container';
import {
  analyticsForecastBodySchema,
  crimeReviewReportsQuerySchema,
  crimeStatisticsQuerySchema,
  cyberSuspectQuerySchema,
  hotspotQuerySchema,
  recommendationQuerySchema,
  repeatOffenderQuerySchema,
  riskScoreQuerySchema,
  victimDemographicsQuerySchema,
} from '../validators/analytics.validators';

export const analyticsRouter = Router();

analyticsRouter.use(authenticateMiddleware, requirePermissions(PERMISSIONS.ANALYTICS_READ));

analyticsRouter.get(
  '/crime-trends',
  validate({ query: crimeStatisticsQuerySchema }),
  asyncHandler(analyticsController.listCrimeStatistics),
);
analyticsRouter.get(
  '/district-comparison',
  validate({ query: crimeStatisticsQuerySchema }),
  notImplemented('District comparison analytics'),
);
analyticsRouter.post(
  '/forecast',
  validate({ body: analyticsForecastBodySchema }),
  notImplemented('Crime forecasting'),
);
analyticsRouter.get(
  '/attention-summary',
  validate({ query: hotspotQuerySchema }),
  notImplemented('Operational attention summary'),
);
analyticsRouter.get(
  '/crime-review-reports',
  validate({ query: crimeReviewReportsQuerySchema }),
  asyncHandler(analyticsController.listCrimeReviewReports),
);
analyticsRouter.get(
  '/victim-demographics',
  validate({ query: victimDemographicsQuerySchema }),
  asyncHandler(analyticsController.listVictimDemographics),
);
analyticsRouter.get(
  '/cyber-suspects',
  validate({ query: cyberSuspectQuerySchema }),
  asyncHandler(analyticsController.listCyberSuspectStatistics),
);
analyticsRouter.get(
  '/hotspots',
  validate({ query: hotspotQuerySchema }),
  asyncHandler(analyticsController.listHotspots),
);
analyticsRouter.get(
  '/risk-scores',
  validate({ query: riskScoreQuerySchema }),
  asyncHandler(analyticsController.listRiskScores),
);
analyticsRouter.get(
  '/recommendations',
  validate({ query: recommendationQuerySchema }),
  asyncHandler(analyticsController.listRecommendations),
);
analyticsRouter.get(
  '/repeat-offenders',
  validate({ query: repeatOffenderQuerySchema }),
  asyncHandler(analyticsController.listRepeatOffenderProfiles),
);
analyticsRouter.get(
  '/crime-statistics/aggregate',
  validate({ query: crimeStatisticsQuerySchema }),
  asyncHandler(analyticsController.getCrimeStatisticAggregate),
);
