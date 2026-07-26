import { Router } from 'express';
import { PERMISSIONS } from '@core/auth/permissions';
import { asyncHandler } from '@core/response/async-handler';
import { validate } from '@core/validation/validate';
import { authenticateMiddleware } from '@middleware/authenticate.middleware';
import { requireAnyPermission } from '@middleware/authorize.middleware';
import { notImplemented } from '@middleware/not-implemented.middleware';
import { dashboardController } from '../dashboard.container';
import { officerDashboardParamsSchema } from '../validators/dashboard.validators';

export const dashboardRouter = Router();

const requireDashboardAccess = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ,
);

dashboardRouter.use(authenticateMiddleware, requireDashboardAccess);

dashboardRouter.get('/overview', asyncHandler(dashboardController.getOverview));
dashboardRouter.get('/summary', asyncHandler(dashboardController.getOverview));
dashboardRouter.get('/officers/:employeeId', validate({ params: officerDashboardParamsSchema }), asyncHandler(dashboardController.getOfficerDashboard));
dashboardRouter.get('/recent-cases', notImplemented('Dashboard recent cases endpoint variant'));
dashboardRouter.get('/hotspots', notImplemented('Dashboard hotspot endpoint variant'));
dashboardRouter.get('/alerts', notImplemented('Dashboard alerts endpoint'));
dashboardRouter.get('/officer-performance', notImplemented('Dashboard officer performance endpoint'));
