import { PromptShield } from '../../security/prompt-shield';
import type { typeofAiGraphState } from '../state';
import { aiLogger } from '../../../shared/ai-logger';

export async function securityShieldNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  aiLogger.info('Executing Security Shield', state.context);
  
  const lastMessage = state.messages[state.messages.length - 1];
  const query = lastMessage?.content?.toString() || '';

  const evaluation = PromptShield.detectInjection(query);

  if (!evaluation.isSafe) {
    aiLogger.warn(`Prompt Injection Blocked: ${evaluation.reason}`, state.context);
    return {
      permissions: {
        clearanceGranted: false,
        reason: evaluation.reason || 'Security violation',
      },
      warnings: ['PROMPT_INJECTION_BLOCKED']
    };
  }

  return {
    permissions: {
      clearanceGranted: true,
      reason: 'Safe',
    }
  };
}
