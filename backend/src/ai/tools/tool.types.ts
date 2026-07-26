import type { Permission } from '@core/auth/permissions';
import type { Role } from '@core/auth/roles';
import type { AiRequestContext } from '../shared/ai-request.types';
import type { AiExecutionResult } from '../shared/ai-result.types';

export type AiToolName =
  | 'searchCase'
  | 'searchVictim'
  | 'searchAccused'
  | 'searchOfficer'
  | 'searchActs'
  | 'searchIPC'
  | 'searchAnalytics'
  | 'searchGraph'
  | 'searchHotspots'
  | 'searchRecommendations'
  | 'findSimilarCases'
  | 'generateTimeline'
  | 'generateSummary'
  | 'recommendIPC'
  | 'translate'
  | 'speechToText'
  | 'textToSpeech';

export type AiToolCategory =
  | 'investigation'
  | 'legal'
  | 'analytics'
  | 'graph'
  | 'recommendation'
  | 'communication';

export type AiToolScalarType = 'string' | 'number' | 'boolean' | 'date' | 'uuid' | 'bigint' | 'array' | 'object' | 'enum';

export type AiToolErrorCode =
  | 'AI_TOOL_VALIDATION_ERROR'
  | 'AI_TOOL_PERMISSION_DENIED'
  | 'AI_TOOL_NOT_FOUND'
  | 'AI_TOOL_TIMEOUT'
  | 'AI_TOOL_DEPENDENCY_UNAVAILABLE'
  | 'AI_TOOL_UNSUPPORTED_INPUT'
  | 'AI_TOOL_RATE_LIMITED';

export interface AiToolExecutionContext {
  request: AiRequestContext;
  activeCaseMasterId?: bigint;
  evidenceOnly?: boolean;
  traceId?: string;
}

export interface AiToolFieldValidationRule {
  field: string;
  type: AiToolScalarType;
  required: boolean;
  description: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  allowedValues?: readonly string[];
  pattern?: string;
}

export interface AiToolValidationSchema {
  inputRules: readonly AiToolFieldValidationRule[];
  crossFieldRules?: readonly string[];
  outputNotes?: readonly string[];
}

export interface AiToolPermissionPolicy {
  allowedRoles: readonly Role[];
  requiredPermissions: readonly Permission[];
  requireAuthenticatedUser: boolean;
  requireAiAccess: boolean;
  requireCaseScope?: boolean;
  requireDistrictScope?: boolean;
  requireUnitScope?: boolean;
  requireSupervisorRole?: boolean;
  maskSensitiveFields?: readonly string[];
}

export interface AiToolErrorDefinition {
  code: AiToolErrorCode;
  when: string;
  retryable: boolean;
  auditSeverity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AiToolLoggingPolicy {
  auditAction: string;
  includeInput: boolean;
  includeOutputSummary: boolean;
  includeLatencyMs: boolean;
  includeResultCount: boolean;
  redactFields: readonly string[];
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface AiToolContract<TInput, TOutput> {
  readonly name: AiToolName;
  readonly category: AiToolCategory;
  readonly description: string;
  readonly input: TInput;
  readonly output: TOutput;
  readonly validation: AiToolValidationSchema;
  readonly permissions: AiToolPermissionPolicy;
  readonly errors: readonly AiToolErrorDefinition[];
  readonly logging: AiToolLoggingPolicy;
}

export interface AiTool<TInput, TOutput> {
  readonly contract: AiToolContract<TInput, TOutput>;
  validate(input: TInput): void | Promise<void>;
  execute(input: TInput, context: AiToolExecutionContext): Promise<AiExecutionResult<TOutput>>;
}
