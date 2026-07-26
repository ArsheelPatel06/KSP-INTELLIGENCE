import { Router } from 'express';
import { PERMISSIONS } from '@core/auth/permissions';
import { asyncHandler } from '@core/response/async-handler';
import { validate } from '@core/validation/validate';
import { authenticateMiddleware } from '@middleware/authenticate.middleware';
import { requirePermissions } from '@middleware/authorize.middleware';
import { chatController } from '../chat.container';
import {
  chatSessionParamsSchema,
  createChatSessionBodySchema,
  listChatSessionsQuerySchema,
  sendChatMessageBodySchema,
} from '../validators/chat.validators';

export const chatRouter = Router();

chatRouter.use(authenticateMiddleware, requirePermissions(PERMISSIONS.AI_USE));

chatRouter.post('/sessions', validate({ body: createChatSessionBodySchema }), asyncHandler(chatController.createSession));
chatRouter.get('/sessions', validate({ query: listChatSessionsQuerySchema }), asyncHandler(chatController.listSessions));
chatRouter.post('/sessions/:chatSessionId/messages', validate({ params: chatSessionParamsSchema, body: sendChatMessageBodySchema }), asyncHandler(chatController.sendMessage));
chatRouter.get('/sessions/:chatSessionId', validate({ params: chatSessionParamsSchema }), asyncHandler(chatController.getSessionMessages));
