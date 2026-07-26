import { AiGraphState } from '../state';
import { aiLogger } from '../../../shared/ai-logger';
import { OllamaProvider } from '../../../providers/ollama-provider';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { promptManager } from '../../prompts/prompt-manager';

const ConfidenceSchema = z.object({
  score: z.number().min(0).max(100).describe('Overall confidence score of the generated response from 0 to 100'),
  factors: z.array(z.string()).describe('List of factors contributing to this confidence score'),
});

export async function confidenceScoringNode(state: typeof AiGraphState.State): Promise<Partial<typeof AiGraphState.State>> {
  if (!state.evidence || state.evidence.length === 0) {
    return { overallConfidence: 0 };
  }

  const llm = new OllamaProvider('llama3.1');
  const evidenceText = state.evidence.map(e => `Agent: ${e.sourceAgent}\nFacts: ${e.facts.join(', ')}\nCitations: ${e.citations.length}`).join('\n\n');
  const conflictsText = state.resolvedConflicts?.join('\n') || 'None';

  try {
    const systemPromptStr = promptManager.buildPrompt('confidence', {
      evidenceText: evidenceText,
      conflictsText: conflictsText
    });

    const response = await llm.generateStructured(
      [
        new SystemMessage(systemPromptStr),
        new HumanMessage(`Evidence:\n${evidenceText}\n\nResolved Conflicts:\n${conflictsText}`)
      ],
      zodToJsonSchema(ConfidenceSchema)
    );

    const parsed = ConfidenceSchema.parse(response.data);
    
    aiLogger.info('Confidence scoring complete', state.context, { score: parsed.score });

    return {
      overallConfidence: parsed.score
    };
  } catch (error) {
    aiLogger.error('Failed to score confidence', error as Error, state.context);
    return {
      overallConfidence: 50,
      warnings: ['Confidence scoring failed']
    };
  }
}
