export interface AiUserContext {
  userId: string;
  role: string;
  employeeId?: string;
  districtId?: number;
  unitId?: number;
}

export interface AiScreenContext {
  screenName?: string;
  caseMasterId?: bigint;
  activeEntityType?: string;
  activeEntityId?: string;
}

export interface AiRequestContext {
  requestId: string;
  sessionId?: string;
  correlationId?: string;
  user: AiUserContext;
  screen?: AiScreenContext;
  locale?: string;
  channel?: 'chat' | 'dashboard' | 'report' | 'voice' | 'api';
}

/**
 * Normalized request entering the AI layer.
 *
 * Backend modules should translate HTTP or internal events into this shape
 * before invoking the orchestrator so the AI layer remains transport-agnostic.
 */
export interface AiRequest {
  query: string;
  context: AiRequestContext;
  caseMasterId?: bigint;
  metadata?: Record<string, unknown>;
}
