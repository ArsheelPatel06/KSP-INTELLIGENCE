import type { AiMemoryCapabilities } from './memory-manager.interface';
import type { AiMemoryExpiryPolicy, AiMemoryPrivacyRule } from './memory.types';

export const AI_MEMORY_CAPABILITIES: AiMemoryCapabilities = {
  supportsSessionMemory: true,
  supportsCaseMemory: true,
  supportsOfficerContext: true,
  supportsConversationHistory: true,
  supportsTemporaryMemory: true,
  supportsWorkingMemory: true,
  supportsLongTermMemory: true,
  supportsSummarization: true,
  supportsExpiry: true,
  supportsPrivacyControls: true,
};

export const AI_MEMORY_EXPIRY_POLICIES: readonly AiMemoryExpiryPolicy[] = [
  {
    kind: 'temporary',
    retentionPolicy: 'scheduled_expiry',
    ttlSeconds: 1800,
    requiresReviewBeforeDeletion: false,
    reason: 'Temporary reference resolution should expire quickly to avoid stale context.',
  },
  {
    kind: 'working',
    retentionPolicy: 'session',
    ttlSeconds: 7200,
    requiresReviewBeforeDeletion: false,
    reason: 'Working plans should exist only during an active investigation session.',
  },
  {
    kind: 'conversation_history',
    retentionPolicy: 'session',
    ttlSeconds: 86_400,
    requiresReviewBeforeDeletion: false,
    reason: 'Conversation history supports follow-up reasoning within the active session window.',
  },
  {
    kind: 'session',
    retentionPolicy: 'session',
    ttlSeconds: 86_400,
    requiresReviewBeforeDeletion: false,
    reason: 'Session memory should expire after inactivity to reduce stale operational state.',
  },
  {
    kind: 'case',
    retentionPolicy: 'case_lifecycle',
    requiresReviewBeforeDeletion: true,
    reason: 'Case memory may contain important investigation context tied to the case lifecycle.',
  },
  {
    kind: 'officer_context',
    retentionPolicy: 'scheduled_expiry',
    ttlSeconds: 604_800,
    requiresReviewBeforeDeletion: false,
    reason: 'Officer context should refresh periodically to reflect current role and jurisdiction.',
  },
  {
    kind: 'long_term',
    retentionPolicy: 'manual_review',
    requiresReviewBeforeDeletion: true,
    reason: 'Long-term memory preserves high-value patterns and should be reviewed before removal.',
  },
] as const;

export const AI_MEMORY_PRIVACY_RULES: readonly AiMemoryPrivacyRule[] = [
  {
    kind: 'session',
    sensitivity: 'medium',
    allowedRoles: ['SUPER_ADMIN', 'DGP', 'IG', 'SP', 'DSP', 'INSPECTOR', 'SI', 'CRIME_ANALYST'],
    maskFields: ['recentTurns.contentSummary'],
    requireJurisdictionMatch: true,
    requireAuditLog: true,
  },
  {
    kind: 'case',
    sensitivity: 'high',
    allowedRoles: ['SUPER_ADMIN', 'DGP', 'IG', 'SP', 'DSP', 'INSPECTOR', 'SI', 'CRIME_ANALYST'],
    maskFields: ['evidenceSummary'],
    requireJurisdictionMatch: true,
    requireAuditLog: true,
  },
  {
    kind: 'officer_context',
    sensitivity: 'medium',
    allowedRoles: ['SUPER_ADMIN', 'DGP', 'IG', 'SP', 'DSP', 'INSPECTOR', 'SI', 'CRIME_ANALYST', 'POLICY_MAKER'],
    maskFields: ['permissionsSummary'],
    requireJurisdictionMatch: false,
    requireAuditLog: true,
  },
  {
    kind: 'conversation_history',
    sensitivity: 'high',
    allowedRoles: ['SUPER_ADMIN', 'DGP', 'IG', 'SP', 'DSP', 'INSPECTOR', 'SI', 'CRIME_ANALYST'],
    maskFields: ['contentSummary'],
    requireJurisdictionMatch: true,
    requireAuditLog: true,
  },
  {
    kind: 'temporary',
    sensitivity: 'medium',
    allowedRoles: ['SUPER_ADMIN', 'DGP', 'IG', 'SP', 'DSP', 'INSPECTOR', 'SI', 'CRIME_ANALYST'],
    maskFields: ['resolvedReferences'],
    requireJurisdictionMatch: true,
    requireAuditLog: true,
  },
  {
    kind: 'working',
    sensitivity: 'medium',
    allowedRoles: ['SUPER_ADMIN', 'DGP', 'IG', 'SP', 'DSP', 'INSPECTOR', 'SI', 'CRIME_ANALYST'],
    maskFields: ['currentPlanSteps'],
    requireJurisdictionMatch: true,
    requireAuditLog: true,
  },
  {
    kind: 'long_term',
    sensitivity: 'critical',
    allowedRoles: ['SUPER_ADMIN', 'DGP', 'IG', 'SP', 'DSP', 'CRIME_ANALYST'],
    maskFields: ['summary'],
    requireJurisdictionMatch: true,
    requireAuditLog: true,
    notes: ['Long-term memory may encode sensitive cross-case patterns and must be tightly governed.'],
  },
] as const;
