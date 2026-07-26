import { analyticsRepository } from '@modules/analytics/analytics.container';
import { RecommendationController } from './controllers/recommendation.controller';
import { RecommendationService } from './services/recommendation.service';

export const recommendationService = new RecommendationService(analyticsRepository);
export const recommendationController = new RecommendationController(recommendationService);
