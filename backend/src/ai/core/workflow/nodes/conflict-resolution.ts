import { AiGraphState } from '../state';
import { aiLogger } from '../../../shared/ai-logger';
import { OllamaProvider } from '../../../providers/ollama-provider';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { promptManager } from '../../../prompts/prompt-manager';

const ConflictSchema = z.object({
  conflicts: z.array(z.string()).describe('List of conflicting facts found between agents, if any'),
  resolutions: z.array(z.string()).describe('How each conflict was resolved, or which agent was trusted more'),
});

export async function conflictResolutionNode(state: typeof AiGraphState.State): Promise<Partial<typeof AiGraphState.State>> {
  if (!state.evidence || state.evidence.length === 0) {
    return { resolvedConflicts: [] };
  }

  const llm = getProvider();
  const evidenceText = state.evidence.map(e => `Agent: ${e.sourceAgent}\nFacts: ${e.facts.join(', ')}`).join('\n\n');

  try {
    const systemPromptStr = promptManager.buildPrompt('conflict', {
      evidenceText: evidenceText
    });

    const response = await llm.generateStructuredJson(
      [
        { role: 'system', content: systemPromptStr },
        { role: 'user', content: `Evidence:\n${evidenceText}` }
      ],
      zodToJsonSchema(ConflictSchema) as Record<string, unknown>,
      { model: 'llama3.1' },
      state.context
    );

    const parsed = ConflictSchema.parse(response.data);
    
    aiLogger.info('Conflict resolution complete', state.context, { conflictsFound: parsed.conflicts.length });

    return {
      resolvedConflicts: parsed.resolutions
    };
  } catch (error) {
    aiLogger.error('Failed to resolve conflicts', error as Error, state.context);
    return {
      resolvedConflicts: [],
      warnings: ['Conflict resolution failed']
    };
  }
}
