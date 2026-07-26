import { AnalyticsController } from './controllers/analytics.controller';
import { PrismaAnalyticsRepository } from './repositories/prisma-analytics.repository';
import { AnalyticsService } from './services/analytics.service';

export const analyticsRepository = new PrismaAnalyticsRepository();
export const analyticsService = new AnalyticsService(analyticsRepository);
export const analyticsController = new AnalyticsController(analyticsService);
