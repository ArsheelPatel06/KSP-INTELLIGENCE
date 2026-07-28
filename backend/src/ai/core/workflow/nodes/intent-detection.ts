import { getProvider } from '../../../providers/get-provider';
import { AiGraphState } from '../state';
import { aiLogger } from '../../../shared/ai-logger';
import { OllamaProvider } from '../../../providers/ollama-provider';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { promptManager } from '../../../prompts/prompt-manager';

const IntentSchema = z.object({
  primaryIntent: z.enum([
    'case_search', 
    'legal_advice', 
    'graph_traversal', 
    'analytics_dashboard', 
    'reporting',
    'general_query'
  ]).describe('The core intent of the user query'),
  confidence: z.number().min(0).max(100),
});

export async function intentDetectionNode(state: typeof AiGraphState.State): Promise<Partial<typeof AiGraphState.State>> {
  const llm = getProvider();
  const userQuery = state.messages[state.messages.length - 1]?.content.toString() || '';

  try {
    const systemPromptStr = promptManager.buildPrompt('intent', {});
    const response = await llm.generateStructuredJson(
      [
        { role: 'system', content: systemPromptStr },
        { role: 'user', content: userQuery }
      ],
      zodToJsonSchema(IntentSchema) as Record<string, unknown>,
      { model: 'llama3.1' },
      state.context
    );

    const parsed = IntentSchema.parse(response.data);

    aiLogger.info('Intent detected', state.context, { intent: parsed.primaryIntent, confidence: parsed.confidence });

    return {
      detectedIntent: parsed.primaryIntent
    };
  } catch (error) {
    aiLogger.error('Failed to detect intent', error as Error, state.context);
    return {
      detectedIntent: 'general_query',
      warnings: ['Intent detection failed, defaulted to general_query']
    };
  }
}
