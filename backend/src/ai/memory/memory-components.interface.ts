import type {
  AiCaseMemory,
  AiConversationTurn,
  AiLongTermMemory,
  AiMemoryEnvelope,
  AiMemoryKind,
  AiMemorySummary,
  AiOfficerContextMemory,
  AiSessionMemory,
  AiTemporaryMemory,
  AiWorkingMemory,
} from './memory.types';

export interface AiSessionMemoryStore {
  get(sessionId: string): Promise<AiMemoryEnvelope<AiSessionMemory> | null>;
  save(memory: AiMemoryEnvelope<AiSessionMemory>): Promise<void>;
}

export interface AiCaseMemoryStore {
  get(caseMasterId: bigint, sessionId?: string): Promise<AiMemoryEnvelope<AiCaseMemory> | null>;
  save(memory: AiMemoryEnvelope<AiCaseMemory>): Promise<void>;
}

export interface AiOfficerContextStore {
  get(userId: string): Promise<AiMemoryEnvelope<AiOfficerContextMemory> | null>;
  save(memory: AiMemoryEnvelope<AiOfficerContextMemory>): Promise<void>;
}

export interface AiConversationHistoryStore {
  list(sessionId: string): Promise<AiConversationTurn[]>;
  append(sessionId: string, turn: AiConversationTurn): Promise<void>;
}

export interface AiTemporaryMemoryStore {
  get(sessionId: string): Promise<AiMemoryEnvelope<AiTemporaryMemory> | null>;
  save(memory: AiMemoryEnvelope<AiTemporaryMemory>): Promise<void>;
  clear(sessionId: string): Promise<void>;
}

export interface AiWorkingMemoryStore {
  get(sessionId: string): Promise<AiMemoryEnvelope<AiWorkingMemory> | null>;
  save(memory: AiMemoryEnvelope<AiWorkingMemory>): Promise<void>;
}

export interface AiLongTermMemoryStore {
  search(userId?: string, caseMasterId?: bigint): Promise<AiMemoryEnvelope<AiLongTermMemory>[]>;
  save(memory: AiMemoryEnvelope<AiLongTermMemory>): Promise<void>;
}

export interface AiMemorySummarizer {
  summarize(kind: AiMemoryKind, content: unknown): Promise<AiMemorySummary>;
}

export interface AiMemoryExpiryManager {
  shouldExpire(kind: AiMemoryKind, updatedAt: string): Promise<boolean>;
  purgeExpired(): Promise<number>;
}

export interface AiMemoryPrivacyManager {
  authorize(kind: AiMemoryKind, userRole: string, districtId?: number, unitId?: number): Promise<boolean>;
  mask(kind: AiMemoryKind, payload: unknown): Promise<unknown>;
}
