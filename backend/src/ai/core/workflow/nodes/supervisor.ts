import { getProvider } from '../../../providers/get-provider';
import { AiGraphState } from '../state';
import { aiLogger } from '../../../shared/ai-logger';
import { OllamaProvider } from '../../../providers/ollama-provider';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { promptManager } from '../../../prompts/prompt-manager';

const SupervisorPlanSchema = z.object({
  agentsToRun: z.array(z.enum(['investigation', 'legal', 'graph', 'analytics', 'recommendation'])),
  isSensitive: z.boolean(),
  clearanceGranted: z.boolean(),
  reasoning: z.string(),
});

export async function supervisorNode(state: typeof AiGraphState.State): Promise<Partial<typeof AiGraphState.State>> {
  const llm = getProvider();
  const userQuery = state.messages[state.messages.length - 1]?.content.toString() || '';
  
  // Combine context for the supervisor
  const intent = state.detectedIntent || 'general';
  const entities = state.extractedEntities ? JSON.stringify(state.extractedEntities) : '{}';

  try {
    const systemPromptStr = promptManager.buildPrompt('supervisor', {
      intent: intent,
      entities: entities,
      district_scope: 'District: ' + (state.context?.jurisdictionId?.toString() || 'Global'),
      priority_threshold: 'Normal',
      reviewed_signals_only: 'false'
    });

    const response = await llm.generateStructuredJson(
      [
        { role: 'system', content: systemPromptStr },
        { role: 'user', content: userQuery }
      ],
      zodToJsonSchema(SupervisorPlanSchema) as Record<string, unknown>,
      { model: 'llama3.1' },
      state.context
    );

    const plan = SupervisorPlanSchema.parse(response.data);

    aiLogger.info('Supervisor executed plan', state.context, { plan });

    if (!plan.clearanceGranted) {
      return {
        warnings: ['Supervisor denied clearance for this operation: ' + plan.reasoning],
        taskPlan: {
          agentsToRun: [],
          primaryIntent: intent,
          isSensitive: true,
        },
        permissions: { clearanceGranted: false }
      };
    }

    return {
      taskPlan: {
        agentsToRun: plan.agentsToRun,
        primaryIntent: intent,
        isSensitive: plan.isSensitive,
      },
      permissions: { clearanceGranted: true }
    };
  } catch (error) {
    aiLogger.error('Supervisor failed', error as Error, state.context);
    return {
      taskPlan: {
        agentsToRun: ['investigation'], // fallback
        primaryIntent: intent,
        isSensitive: false,
      },
      warnings: ['Supervisor planning failed']
    };
  }
}
