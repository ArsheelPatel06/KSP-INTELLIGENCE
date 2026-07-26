import type { AiRequestContext } from '../shared/ai-request.types';
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
} from './memory.types';
import type {
  AiCaseMemoryStore,
  AiConversationHistoryStore,
  AiLongTermMemoryStore,
  AiMemoryExpiryManager,
  AiMemoryPrivacyManager,
  AiMemorySummarizer,
  AiOfficerContextStore,
  AiSessionMemoryStore,
  AiTemporaryMemoryStore,
  AiWorkingMemoryStore,
} from './memory-components.interface';

export interface AiMemoryCapabilities {
  supportsSessionMemory: boolean;
  supportsCaseMemory: boolean;
  supportsOfficerContext: boolean;
  supportsConversationHistory: boolean;
  supportsTemporaryMemory: boolean;
  supportsWorkingMemory: boolean;
  supportsLongTermMemory: boolean;
  supportsSummarization: boolean;
  supportsExpiry: boolean;
  supportsPrivacyControls: boolean;
}

export interface AiMemoryDependencies {
  sessionMemoryStore: AiSessionMemoryStore;
  caseMemoryStore: AiCaseMemoryStore;
  officerContextStore: AiOfficerContextStore;
  conversationHistoryStore: AiConversationHistoryStore;
  temporaryMemoryStore: AiTemporaryMemoryStore;
  workingMemoryStore: AiWorkingMemoryStore;
  longTermMemoryStore: AiLongTermMemoryStore;
  summarizer: AiMemorySummarizer;
  expiryManager: AiMemoryExpiryManager;
  privacyManager: AiMemoryPrivacyManager;
}

export interface AiMemoryManager {
  readonly capabilities: AiMemoryCapabilities;
  readonly dependencies: AiMemoryDependencies;
  readonly expiryPolicies: readonly AiMemoryExpiryPolicy[];
  readonly privacyRules: readonly AiMemoryPrivacyRule[];

  loadSessionMemory(context: AiRequestContext): Promise<AiMemoryEnvelope<AiSessionMemory> | null>;
  loadCaseMemory(caseMasterId: bigint, context: AiRequestContext): Promise<AiMemoryEnvelope<AiCaseMemory> | null>;
  loadOfficerContext(context: AiRequestContext): Promise<AiMemoryEnvelope<AiOfficerContextMemory> | null>;
  loadTemporaryMemory(sessionId: string): Promise<AiMemoryEnvelope<AiTemporaryMemory> | null>;
  loadWorkingMemory(sessionId: string): Promise<AiMemoryEnvelope<AiWorkingMemory> | null>;
  loadLongTermMemory(context: AiRequestContext, caseMasterId?: bigint): Promise<AiMemoryEnvelope<AiLongTermMemory>[]>;

  appendConversationTurn(sessionId: string, turn: AiConversationTurn): Promise<void>;
  summarizeMemory(kind: AiMemoryKind, content: unknown): Promise<string>;
}
