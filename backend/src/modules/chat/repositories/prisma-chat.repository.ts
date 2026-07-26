import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@core/database/prisma';
import { buildPaginationMeta, normalizePagination } from '@core/pagination/pagination';
import type { ChatRepository, CreateChatMessageInput } from '../interfaces/chat-repository.interface';
import {
  chatMessageSelect,
  chatSessionDetailSelect,
  chatSessionListSelect,
  type ChatSessionListQuery,
  type CreateChatSessionInput,
} from '../types/chat.types';

export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async createSession(input: CreateChatSessionInput) {
    return this.client.chatSession.create({
      data: {
        employeeId: input.employeeId,
        caseMasterId: input.caseMasterId,
        sessionPurpose: input.sessionPurpose,
        securityClassification: input.securityClassification,
        modelVersion: input.modelVersion,
      },
      select: chatSessionDetailSelect,
    });
  }

  async findSessionById(chatSessionId: bigint) {
    return this.client.chatSession.findUnique({
      where: { id: chatSessionId },
      select: chatSessionDetailSelect,
    });
  }

  async listSessions(input: ChatSessionListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.chatSession.findMany({
        where,
        select: chatSessionListSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ sessionStartedOn: 'desc' }, { id: 'desc' }],
      }),
      this.client.chatSession.count({ where }),
    ]);

    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords,
      }),
    };
  }

  async createMessage(input: CreateChatMessageInput) {
    return this.client.$transaction(async (tx) => {
      const currentMax = await tx.chatMessage.aggregate({
        where: { chatSessionId: input.chatSessionId },
        _max: { messageSequence: true },
      });

      return tx.chatMessage.create({
        data: {
          chatSessionId: input.chatSessionId,
          messageSequence: (currentMax._max.messageSequence ?? 0) + 1,
          senderRole: input.senderRole,
          messageText: input.messageText,
          linkedRecommendationId: input.linkedRecommendationId,
          linkedAuditLogId: input.linkedAuditLogId,
        },
        select: chatMessageSelect,
      });
    });
  }

  private buildWhere(input: ChatSessionListQuery): Prisma.ChatSessionWhereInput {
    const where: Prisma.ChatSessionWhereInput = {};
    const and: Prisma.ChatSessionWhereInput[] = [];

    if (input.caseMasterId) and.push({ caseMasterId: input.caseMasterId });
    if (input.employeeId) and.push({ employeeId: input.employeeId });
    if (input.fromDate || input.toDate) {
      and.push({
        sessionStartedOn: {
          gte: input.fromDate,
          lte: input.toDate,
        },
      });
    }

    if (and.length > 0) where.AND = and;
    return where;
  }
}
