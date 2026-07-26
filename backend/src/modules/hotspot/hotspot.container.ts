import { analyticsRepository } from '@modules/analytics/analytics.container';
import { HotspotController } from './controllers/hotspot.controller';
import { HotspotService } from './services/hotspot.service';

export const hotspotService = new HotspotService(analyticsRepository);
export const hotspotController = new HotspotController(hotspotService);
