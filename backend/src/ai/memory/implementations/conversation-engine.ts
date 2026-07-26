import type { AiMemoryManager, AiMemoryCapabilities, AiMemoryDependencies } from '../memory-manager.interface';
import type { AiRequestContext } from '../../shared/ai-request.types';
import type {
  AiCaseMemory,
  AiConversationTurn,
  AiLongTermMemory,
  AiMemoryEnvelope,
  AiMemoryExpiryPolicy,
  AiMemoryKind,
  AiMemoryPrivacyRule,
  AiOfficerContextMemory,
  AiSessionMemory,
  AiTemporaryMemory,
  AiWorkingMemory,
} from '../memory.types';
import { RedisMemoryStore } from './redis-store';
import { MemorySummarizer } from './memory-summarizer';
import { aiLogger } from '../../shared/ai-logger';

export class ConversationEngine implements AiMemoryManager {
  public readonly capabilities: AiMemoryCapabilities = {
    supportsSessionMemory: true,
    supportsCaseMemory: true,
    supportsOfficerContext: true,
    supportsConversationHistory: true,
    supportsTemporaryMemory: false,
    supportsWorkingMemory: false,
    supportsLongTermMemory: false,
    supportsSummarization: true,
    supportsExpiry: true,
    supportsPrivacyControls: false,
  };

  private store = new RedisMemoryStore();
  private summarizerSvc = new MemorySummarizer();

  // Stubbing dependencies for the interface compliance, though we tightly couple them in this implementation for simplicity
  public readonly dependencies: AiMemoryDependencies = {
    sessionMemoryStore: this.store,
    caseMemoryStore: this.store,
    officerContextStore: this.store,
    conversationHistoryStore: this.store,
    temporaryMemoryStore: null as any,
    workingMemoryStore: null as any,
    longTermMemoryStore: null as any,
    summarizer: this.summarizerSvc,
    expiryManager: null as any,
    privacyManager: null as any,
  };

  public readonly expiryPolicies: readonly AiMemoryExpiryPolicy[] = [];
  public readonly privacyRules: readonly AiMemoryPrivacyRule[] = [];

  async loadSessionMemory(context: AiRequestContext): Promise<AiMemoryEnvelope<AiSessionMemory> | null> {
    return this.store.get(context.sessionId);
  }

  async loadCaseMemory(caseMasterId: bigint, context: AiRequestContext): Promise<AiMemoryEnvelope<AiCaseMemory> | null> {
    return this.store.getCaseMemory(caseMasterId);
  }

  async loadOfficerContext(context: AiRequestContext): Promise<AiMemoryEnvelope<AiOfficerContextMemory> | null> {
    return this.store.getOfficerContext(context.userId);
  }

  async loadTemporaryMemory(sessionId: string): Promise<AiMemoryEnvelope<AiTemporaryMemory> | null> {
    return null;
  }

  async loadWorkingMemory(sessionId: string): Promise<AiMemoryEnvelope<AiWorkingMemory> | null> {
    return null;
  }

  async loadLongTermMemory(context: AiRequestContext, caseMasterId?: bigint): Promise<AiMemoryEnvelope<AiLongTermMemory>[]> {
    return [];
  }

  async appendConversationTurn(sessionId: string, turn: AiConversationTurn): Promise<void> {
    await this.store.append(sessionId, turn);

    // Context Compression: If history exceeds 10 turns, compress the oldest 6 turns into a summary
    const history = await this.store.list(sessionId);
    if (history.length > 10) {
      aiLogger.info('Compressing conversation history', { sessionId, length: history.length });
      const turnsToCompress = history.slice(0, 6);
      const remainingTurns = history.slice(6);
      
      const summaryText = await this.summarizeMemory('conversation', turnsToCompress);
      
      const compressedTurn: AiConversationTurn = {
        role: 'system',
        content: `[PREVIOUS CONVERSATION SUMMARY]: ${summaryText}`,
        timestamp: new Date().toISOString(),
      };

      await this.store.replaceHistory(sessionId, [compressedTurn, ...remainingTurns]);
    }
  }

  async summarizeMemory(kind: AiMemoryKind, content: unknown): Promise<string> {
    const summary = await this.summarizerSvc.summarize(kind, content);
    return summary.summaryText;
  }
}
