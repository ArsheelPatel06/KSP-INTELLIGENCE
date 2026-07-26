import { caseService } from '@modules/cases/cases.container';
import { graphService } from '@modules/graph/graph.container';
import { recommendationService } from '@modules/recommendations/recommendations.container';
import { ChatController } from './controllers/chat.controller';
import { PrismaChatRepository } from './repositories/prisma-chat.repository';
import { ChatService } from './services/chat.service';

export const chatRepository = new PrismaChatRepository();
export const chatService = new ChatService(
  chatRepository,
  caseService,
  recommendationService,
  graphService,
);
export const chatController = new ChatController(chatService);
