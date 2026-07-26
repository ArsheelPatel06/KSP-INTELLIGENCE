import { createModuleRouter } from '../../../app/routes';
import { AiController } from '../controllers/ai.controller';
import { authenticateMiddleware } from '../../../middleware/authenticate.middleware';
import { requireRoles } from '../../../middleware/authorize.middleware';

export const aiRouter = createModuleRouter();

// Basic health check to ensure the on-premise Ollama instance is hot
aiRouter.get('/health', authenticateMiddleware, requireRoles('SUPER_ADMIN', 'INSPECTOR', 'CRIME_ANALYST'), AiController.health);

// Main orchestrator entry point
aiRouter.post('/query', authenticateMiddleware, requireRoles('SUPER_ADMIN', 'INSPECTOR', 'CRIME_ANALYST'), AiController.query);
