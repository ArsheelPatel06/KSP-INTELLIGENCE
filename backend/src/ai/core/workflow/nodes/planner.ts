import { z } from 'zod';
import type { typeofAiGraphState } from '../state';
import { OllamaProvider } from '../../../providers/ollama-provider';
import { StructuredParser } from '../../../core/structured-parser';
import { aiLogger } from '../../../shared/ai-logger';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const plannerSchema = z.object({
  agentsToRun: z.array(z.enum(['investigation', 'legal', 'graph', 'analytics', 'recommendation'])),
  primaryIntent: z.string(),
  isSensitive: z.boolean(),
});

/**
 * The Planner Node examines the incoming query and decides which agents need to execute.
 */
export async function plannerNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  const provider = getProvider();
  
  const lastMessage = state.messages[state.messages.length - 1];
  const query = lastMessage?.content?.toString() || '';

  aiLogger.info(`Planner analyzing query: "${query.slice(0, 50)}..."`, state.context);

  const systemPrompt = `
You are the Chief Intelligence Planner for a Police AI system.
Analyze the user's query and decide which specialized agents are required to answer it.
Available Agents:
- investigation: Case facts, FIR summaries, suspect timelines
- legal: Penal codes (BNS, IPC), legal procedures, bail conditions
- graph: Phone links, gang networks, indirect associations
- analytics: Crime trends, district statistics, hotspots
- recommendation: Next investigative steps, risk assessments

You must output a JSON object matching the provided schema.
`;

  try {
    const response = await provider.generateStructuredJson<z.infer<typeof plannerSchema>>(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      StructuredParser.generateSchema(plannerSchema, 'TaskPlan'),
      {},
      state.context
    );

    aiLogger.info(`Planner routing to: ${response.data.agentsToRun.join(', ')}`, state.context);

    return {
      taskPlan: response.data,
    };
  } catch (error) {
    aiLogger.error('Planner node failed', error as Error, state.context);
    // Fallback if structured parsing fails: route to investigation only
    return {
      taskPlan: {
        agentsToRun: ['investigation'],
        primaryIntent: 'unknown',
        isSensitive: true,
      },
      warnings: ['Planner failed to classify intent, falling back to investigation only.'],
    };
  }
}
