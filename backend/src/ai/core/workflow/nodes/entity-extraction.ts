import { getProvider } from '../../../providers/get-provider';
import { AiGraphState } from '../state';
import { aiLogger } from '../../../shared/ai-logger';
import { OllamaProvider } from '../../../providers/ollama-provider';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { promptManager } from '../../../prompts/prompt-manager';

const EntitySchema = z.object({
  people: z.array(z.string()).optional(),
  vehicles: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  acts: z.array(z.string()).optional(),
  dates: z.array(z.string()).optional(),
});

export async function entityExtractionNode(state: typeof AiGraphState.State): Promise<Partial<typeof AiGraphState.State>> {
  const llm = getProvider();
  const userQuery = state.messages[state.messages.length - 1]?.content.toString() || '';

  try {
    const systemPromptStr = promptManager.buildPrompt('entity', {});
    const response = await llm.generateStructuredJson(
      [
        { role: 'system', content: systemPromptStr },
        { role: 'user', content: userQuery }
      ],
      zodToJsonSchema(EntitySchema) as Record<string, unknown>,
      { model: 'llama3.1' },
      state.context
    );

    const parsed = EntitySchema.parse(response.data);
    const entities = parsed as Record<string, string[]>;

    aiLogger.info('Entities extracted', state.context, { entities });

    return {
      extractedEntities: entities
    };
  } catch (error) {
    aiLogger.error('Failed to extract entities', error as Error, state.context);
    return {
      extractedEntities: {},
      warnings: ['Entity extraction failed']
    };
  }
}
