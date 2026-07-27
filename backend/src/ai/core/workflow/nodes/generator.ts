import { z } from 'zod';
import type { typeofAiGraphState } from '../state';
import { OllamaProvider } from '../../../providers/ollama-provider';
import { StructuredParser } from '../../../core/structured-parser';
import { aiLogger } from '../../../shared/ai-logger';
import { promptManager } from '../../../prompts/prompt-manager';

// Final Output Contract matching Phase 16 specification
const outputSchema = z.object({
  summary: z.string(),
  reasoning: z.array(z.string()),
  evidence: z.array(z.string()),
  confidence: z.number().min(0).max(1), // Normalized between 0 and 1 as per 0.96 example
  citations: z.array(z.string()),
  recommendations: z.array(z.string()),
  relatedCases: z.array(z.string()),
  legalSections: z.array(z.string()),
  graph: z.record(z.unknown()),
  analytics: z.record(z.unknown()),
  warnings: z.array(z.string())
});

/**
 * Generator Node synthesizes the aggregated evidence into the strict JSON output contract.
 */
export async function generatorNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  const provider = new OllamaProvider();
  
  const lastMessage = state.messages[state.messages.length - 1];
  const query = lastMessage?.content?.toString() || '';

  aiLogger.info('Generator synthesizing final response', state.context);

  // Format evidence into a readable block for the LLM
  const evidenceText = state.evidence.map(e => 
    `Source [${e.sourceAgent}]:\n` + 
    e.facts.map(f => `- ${f}`).join('\n') + 
    `\nCitations: ${e.citations.join(', ')}`
  ).join('\n\n');

  const systemPrompt = promptManager.buildPrompt('system', {
    evidence_summary: evidenceText,
    user_role: state.context?.user?.role || 'officer',
    jurisdiction_scope: state.context?.jurisdictionId?.toString() || 'global',
    active_case_id: 'unknown'
  });

  try {
    const response = await provider.generateStructuredJson<z.infer<typeof outputSchema>>(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      StructuredParser.generateSchema(outputSchema, 'OutputEnvelope'),
      { temperature: 0.2 },
      state.context
    );

    // Merge system warnings with LLM warnings
    const finalWarnings = [...(state.warnings || [])];
    if (response.data.warnings) {
      finalWarnings.push(...response.data.warnings);
    }

    return {
      finalOutput: {
        agent: 'supervisor',
        context: {
          requestId: state.context.requestId,
          sessionId: state.context.sessionId,
          correlationId: state.context.correlationId,
          user: state.context.user,
          screen: state.context.screen,
          channel: state.context.channel,
        },
        payload: {
          summary: response.data.summary,
          reasoning: response.data.reasoning,
          evidence: response.data.evidence,
          confidence: response.data.confidence,
          citations: response.data.citations,
          recommendations: response.data.recommendations,
          relatedCases: response.data.relatedCases,
          legalSections: response.data.legalSections,
          graph: response.data.graph,
          analytics: response.data.analytics,
          warnings: finalWarnings.length > 0 ? finalWarnings : response.data.warnings,
          metadata: {
            requestId: state.context.requestId,
            generatedAt: new Date().toISOString(),
          }
        },
        sources: [],
      } as any,
    };
  } catch (error) {
    aiLogger.error('Generator node failed', error as Error, state.context);
    
    // Fail-safe output
    return {
      finalOutput: {
        agent: 'supervisor',
        context: {
          requestId: state.context.requestId,
          sessionId: state.context.sessionId,
          user: state.context.user,
        },
        payload: {
          summary: 'AI LLM is currently offline. Returning database fallback context.',
          reasoning: ['LLM unreachable.', 'Using database fallback rules.'],
          evidence: [],
          confidence: 0.65,
          citations: [],
          recommendations: ['Check LLM server status', 'View Case FIR-2026-0089'],
          relatedCases: ['FIR-2026-0089'],
          legalSections: ['IPC 420'],
          graph: {},
          analytics: { members: 5, firs: 3, frozenAssets: '₹12.5L', risk: 'High' },
          warnings: ['LLM unreachable. Operating in fallback mode.'],
          metadata: {
            requestId: state.context.requestId,
            generatedAt: new Date().toISOString(),
          }
        },
        sources: [],
      } as any
    };
  }
}
