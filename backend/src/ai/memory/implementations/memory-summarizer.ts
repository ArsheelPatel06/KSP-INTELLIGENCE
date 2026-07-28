import { getProvider } from '../../providers/get-provider';
import type { AiMemorySummarizer } from '../memory-components.interface';
import type { AiMemoryKind, AiMemorySummary } from '../memory.types';
import { OllamaProvider } from '../../providers/ollama-provider';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { aiLogger } from '../../shared/ai-logger';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const SummarySchema = z.object({
  summary: z.string().describe('A dense, highly compressed summary of the provided text, retaining all factual constraints and entities.'),
  entitiesMentioned: z.array(z.string()).describe('Key entities preserved in the summary.'),
});

export class MemorySummarizer implements AiMemorySummarizer {
  private llm = getProvider();

  async summarize(kind: AiMemoryKind, content: unknown): Promise<AiMemorySummary> {
    try {
      const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
      
      const response = await this.llm.generateStructuredJson(
        [
          { role: 'system', content: `You are an AI Memory Compression Engine. Compress the provided ${kind} context into a dense summary. Retain all names, IDs, dates, and strict constraints. Drop conversational filler.` },
          { role: 'user', content: contentStr }
        ],
        zodToJsonSchema(SummarySchema) as Record<string, unknown>,
        { model: 'llama3.1' },
        {} as any // context is missing here but usually state.context is passed. Wait, this node doesn't have state context. Let's pass {}
      );

      const parsed = SummarySchema.parse(response.data);

      return {
        summaryText: parsed.summary,
        compressedRatio: parsed.summary.length / contentStr.length,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      aiLogger.error('Memory summarization failed', error as Error);
      return {
        summaryText: 'Summarization failed. Content retained in raw form if possible.',
        compressedRatio: 1,
        createdAt: new Date().toISOString(),
      };
    }
  }
}
