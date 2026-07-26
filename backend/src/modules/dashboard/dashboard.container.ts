import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { caseRepository } from '@modules/cases/cases.container';
import { analyticsRepository } from '@modules/analytics/analytics.container';
import { victimRepository } from '@modules/victims/victims.container';
import { officerRepository } from '@modules/officers/officers.container';

export const dashboardService = new DashboardService(
  caseRepository,
  victimRepository,
  officerRepository,
  analyticsRepository,
);

export const dashboardController = new DashboardController(dashboardService);
