import fs from 'fs';
import path from 'path';
import { PromptShield } from './prompt-shield';
import type { AiRequestContext } from '../../shared/ai-request.types';
import { aiLogger } from '../../shared/ai-logger';

export class AuditLogger {
  private static LOG_FILE = path.join(process.cwd(), 'audit.jsonl');

  /**
   * Securely logs an AI request and its outcome to a persistent audit trail.
   */
  public static logExecution(context: AiRequestContext, input: string, output: any, wasBlocked: boolean = false, reason?: string) {
    try {
      const entry = {
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
        sessionId: context.sessionId,
        userId: context.user.userId,
        role: context.user.role,
        inputMasked: PromptShield.maskPII(input),
        wasBlocked,
        blockReason: reason,
        outputMasked: PromptShield.maskPII(typeof output === 'string' ? output : JSON.stringify(output))
      };

      fs.appendFileSync(this.LOG_FILE, JSON.stringify(entry) + '\n');
    } catch (error) {
      aiLogger.error('Failed to write to audit log', error as Error, context);
    }
  }

  /**
   * Securely logs a specific tool invocation
   */
  public static logToolAccess(context: AiRequestContext, toolName: string, args: any, isAuthorized: boolean) {
    try {
      const entry = {
        timestamp: new Date().toISOString(),
        eventType: 'TOOL_ACCESS',
        requestId: context.requestId,
        userId: context.user.userId,
        toolName,
        argsMasked: PromptShield.maskPII(JSON.stringify(args)),
        isAuthorized
      };

      fs.appendFileSync(this.LOG_FILE, JSON.stringify(entry) + '\n');
    } catch (error) {
      aiLogger.error('Failed to write to audit log', error as Error, context);
    }
  }
}
