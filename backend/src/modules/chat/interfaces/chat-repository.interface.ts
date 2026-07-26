import type { PaginatedRepositoryResult } from '@core/interfaces/repository.interface';
import type {
  ChatMessageRecord,
  ChatSessionDetailRecord,
  ChatSessionListItem,
  ChatSessionListQuery,
  CreateChatSessionInput,
} from '../types/chat.types';

export interface CreateChatMessageInput {
  chatSessionId: bigint;
  senderRole: string;
  messageText: string;
  linkedRecommendationId?: bigint;
  linkedAuditLogId?: bigint;
}

export interface ChatRepository {
  createSession(input: CreateChatSessionInput): Promise<ChatSessionDetailRecord>;
  findSessionById(chatSessionId: bigint): Promise<ChatSessionDetailRecord | null>;
  listSessions(input: ChatSessionListQuery): Promise<PaginatedRepositoryResult<ChatSessionListItem>>;
  createMessage(input: CreateChatMessageInput): Promise<ChatMessageRecord>;
}
