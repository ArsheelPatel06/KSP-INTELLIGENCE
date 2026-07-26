import type { typeofAiGraphState } from '../state';
import { aiLogger } from '../../../shared/ai-logger';
import { OllamaProvider } from '../../../providers/ollama-provider';
import { promptManager } from '../../prompts/prompt-manager';

export async function reportAgentNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  aiLogger.info('Executing Report Agent to generate PDF-ready Markdown', state.context);
  const provider = new OllamaProvider();

  const queryMessage = state.messages && state.messages.length > 0 ? state.messages[state.messages.length - 1]?.content || '' : '';

  // Aggregate all evidence gathered by previous agents
  const evidenceText = state.evidence.map(e => 
    `Source [${e.sourceAgent}]:\n` + 
    e.facts.map(f => `- ${f}`).join('\n') + 
    `\nCitations: ${e.citations.join(', ')}`
  ).join('\n\n');

  const systemPrompt = promptManager.buildPrompt('report', {
    report_type: 'Unknown',
    audience_role: state.context?.user?.role || 'officer',
    report_scope: 'Full context'
  }) + `\n\nEvidence:\n${evidenceText}`;

  try {
    const responseText = await provider.generateText(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: queryMessage.toString() }
      ],
      { temperature: 0.1 },
      state.context
    );

    // Append the generated markdown report into the final output payload
    if (state.finalOutput && state.finalOutput.payload) {
        return {
            finalOutput: {
                ...state.finalOutput,
                payload: {
                    ...state.finalOutput.payload,
                    summary: responseText // Replacing the JSON summary with the full markdown report, or appending it.
                }
            } as any
        }
    }

    // Fallback if finalOutput is not yet constructed (e.g. if run instead of generator)
    return {
        finalOutput: {
            agent: 'report',
            context: state.context as any,
            payload: {
                summary: responseText,
                reasoning: [],
                evidence: [],
                confidence: 0.95,
                citations: [],
                relatedCases: [],
                legalSections: [],
                recommendations: [],
                graph: {},
                analytics: {},
                warnings: [],
                metadata: {
                    requestId: state.context.requestId,
                    generatedAt: new Date().toISOString(),
                    outputMode: 'report',
                }
            },
            sources: []
        } as any
    };

  } catch (error: any) {
    aiLogger.error('Report Agent failed to generate markdown', error, state.context);
    return {
      warnings: ['Failed to generate Markdown report.'],
    };
  }
}
