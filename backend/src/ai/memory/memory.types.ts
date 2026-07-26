import type { AiRequestContext } from '../shared/ai-request.types';
import type { AiSourceReference, AiWarning } from '../shared/ai-result.types';

export type AiMemoryKind =
  | 'session'
  | 'case'
  | 'officer_context'
  | 'conversation_history'
  | 'temporary'
  | 'working'
  | 'long_term';

export type AiMemorySensitivity = 'low' | 'medium' | 'high' | 'critical';
export type AiMemoryRetentionPolicy = 'request_only' | 'session' | 'case_lifecycle' | 'scheduled_expiry' | 'manual_review';

export interface AiMemoryReference {
  memoryId: string;
  kind: AiMemoryKind;
  sessionId?: string;
  caseMasterId?: bigint;
  userId?: string;
}

export interface AiConversationTurn {
  turnId: string;
  timestamp: string;
  role: 'user' | 'assistant' | 'system';
  contentSummary: string;
  linkedCaseMasterId?: bigint;
  linkedEntityIds?: string[];
  linkedSourceReferences?: AiSourceReference[];
}

export interface AiSessionMemory {
  sessionId: string;
  userId: string;
  startedAt: string;
  lastActiveAt: string;
  activeIntent?: string;
  activeCaseMasterId?: bigint;
  activeDistrictId?: number;
  activeUnitId?: number;
  recentTurns: AiConversationTurn[];
  summary?: string;
}

export interface AiCaseMemory {
  caseMasterId: bigint;
  sessionId?: string;
  focusedEntities: Array<{
    entityType: string;
    entityId: string;
    label?: string;
  }>;
  caseFactsSummary: string[];
  evidenceSummary: string[];
  recentRecommendations: string[];
  lastUpdatedAt: string;
}

export interface AiOfficerContextMemory {
  userId: string;
  employeeId?: string;
  role: string;
  districtId?: number;
  unitId?: number;
  jurisdictionSummary: string;
  permissionsSummary: string[];
  preferredLanguage?: string;
  sensitivityRestrictions: string[];
}

export interface AiTemporaryMemory {
  sessionId: string;
  resolvedReferences: Array<{
    alias: string;
    resolvedEntityType: string;
    resolvedEntityId: string;
    confidence?: number;
  }>;
  expiresAt: string;
}

export interface AiWorkingMemory {
  sessionId: string;
  activeGoal?: string;
  currentPlanSteps: string[];
  selectedAgents: string[];
  pendingQuestions: string[];
  evidenceChecklist: string[];
  lastUpdatedAt: string;
}

export interface AiLongTermMemory {
  memoryId: string;
  userId?: string;
  caseMasterId?: bigint;
  memoryClass: 'case_pattern' | 'user_preference' | 'jurisdictional_context' | 'investigation_history';
  summary: string;
  sourceReferences: AiSourceReference[];
  createdAt: string;
  lastAccessedAt?: string;
  expiresAt?: string;
}

export interface AiMemorySummary {
  summary: string;
  keyFacts: string[];
  unresolvedReferences: string[];
  warnings: AiWarning[];
}

export interface AiMemoryExpiryPolicy {
  kind: AiMemoryKind;
  retentionPolicy: AiMemoryRetentionPolicy;
  ttlSeconds?: number;
  requiresReviewBeforeDeletion: boolean;
  reason: string;
}

export interface AiMemoryPrivacyRule {
  kind: AiMemoryKind;
  sensitivity: AiMemorySensitivity;
  allowedRoles: string[];
  maskFields: string[];
  requireJurisdictionMatch: boolean;
  requireAuditLog: boolean;
  notes?: string[];
}

export interface AiMemoryEnvelope<TPayload> {
  reference: AiMemoryReference;
  context: Pick<AiRequestContext, 'sessionId' | 'user' | 'locale' | 'channel'>;
  payload: TPayload;
  sensitivity: AiMemorySensitivity;
  createdAt: string;
  updatedAt: string;
}
