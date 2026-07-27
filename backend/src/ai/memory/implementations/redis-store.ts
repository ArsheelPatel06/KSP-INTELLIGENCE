import Redis from 'ioredis';
import type {
  AiCaseMemoryStore,
  AiConversationHistoryStore,
  AiOfficerContextStore,
  AiSessionMemoryStore,
} from '../memory-components.interface';
import type {
  AiCaseMemory,
  AiConversationTurn,
  AiMemoryEnvelope,
  AiOfficerContextMemory,
  AiSessionMemory,
} from '../memory.types';
import { logger } from '../../../core/logger/logger';
import { env } from '../../../config/env';

export class RedisMemoryStore
  implements
    AiSessionMemoryStore,
    AiCaseMemoryStore,
    AiOfficerContextStore,
    AiConversationHistoryStore
{
  private redis: Redis;

  constructor() {
    this.redis = new Redis(env.REDIS_URL);
    this.redis.on('error', (err) => logger.error({ err }, 'Redis Memory Store Error'));
  }

  // --- Session Memory ---
  async get(sessionId: string): Promise<AiMemoryEnvelope<AiSessionMemory> | null> {
    const data = await this.redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }
  async save(memory: AiMemoryEnvelope<AiSessionMemory>): Promise<void> {
    await this.redis.set(`session:${memory.id}`, JSON.stringify(memory), 'EX', 86400); // 24 hours
  }

  // --- Case Context Memory ---
  async getCaseMemory(caseMasterId: bigint): Promise<AiMemoryEnvelope<AiCaseMemory> | null> {
    const data = await this.redis.get(`case:${caseMasterId.toString()}`);
    return data ? JSON.parse(data) : null;
  }
  async saveCaseMemory(memory: AiMemoryEnvelope<AiCaseMemory>): Promise<void> {
    await this.redis.set(`case:${memory.id}`, JSON.stringify(memory), 'EX', 604800); // 7 days
  }

  // --- Officer Context Memory ---
  async getOfficerContext(userId: string): Promise<AiMemoryEnvelope<AiOfficerContextMemory> | null> {
    const data = await this.redis.get(`officer:${userId}`);
    return data ? JSON.parse(data) : null;
  }
  async saveOfficerContext(memory: AiMemoryEnvelope<AiOfficerContextMemory>): Promise<void> {
    await this.redis.set(`officer:${memory.id}`, JSON.stringify(memory), 'EX', 604800);
  }

  // --- Conversation History ---
  async list(sessionId: string): Promise<AiConversationTurn[]> {
    const data = await this.redis.lrange(`history:${sessionId}`, 0, -1);
    return data.map((item) => JSON.parse(item));
  }
  async append(sessionId: string, turn: AiConversationTurn): Promise<void> {
    await this.redis.rpush(`history:${sessionId}`, JSON.stringify(turn));
    await this.redis.expire(`history:${sessionId}`, 86400); // 24 hours
  }
  async replaceHistory(sessionId: string, turns: AiConversationTurn[]): Promise<void> {
    await this.redis.del(`history:${sessionId}`);
    if (turns.length > 0) {
      const stringified = turns.map((t) => JSON.stringify(t));
      await this.redis.rpush(`history:${sessionId}`, ...stringified);
      await this.redis.expire(`history:${sessionId}`, 86400);
    }
  }

  async close(): Promise<void> {
    await this.redis.quit();
  }
}
