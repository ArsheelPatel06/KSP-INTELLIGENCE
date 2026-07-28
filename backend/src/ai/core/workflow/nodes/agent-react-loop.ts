import { z } from 'zod';
import type { typeofAiGraphState } from '../state';
import { aiLogger } from '../../../shared/ai-logger';
import { OllamaProvider } from '../../../providers/ollama-provider';
import type { AiMessage } from '../../../providers/ai-provider.interface';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ToolAuthGuard } from '../../security/tool-auth.guard';

const agentActionJsonSchema = {
  type: 'object',
  properties: {
    thought: { type: 'string', description: 'Your internal reasoning about what to do next based on the case facts and previous tools.' },
    action: { type: 'string', enum: ['call_tool', 'final_answer'], description: 'Whether to call a tool or return the final answer.' },
    toolName: { type: 'string', description: 'Required if action is call_tool. The exact name of the tool to call.' },
    toolArgs: { type: 'object', additionalProperties: true, description: 'Required if action is call_tool. A JSON object of arguments to pass to the tool.' },
    finalFacts: { type: 'array', items: { type: 'string' }, description: 'Required if action is final_answer. Array of key factual insights you discovered.' },
    finalCitations: { type: 'array', items: { type: 'string' }, description: 'Required if action is final_answer. Sources (e.g., Case numbers, FIR numbers) that support your facts.' },
    confidenceScore: { type: 'number', description: 'Required if action is final_answer. Score from 0.0 to 1.0 reflecting how confident you are in the findings.' }
  },
  required: ['thought', 'action']
};

interface AgentAction {
  thought: string;
  action: 'call_tool' | 'final_answer';
  toolName?: string;
  toolArgs?: Record<string, any>;
  finalFacts?: string[];
  finalCitations?: string[];
  confidenceScore?: number;
}

export async function executeAgentReactLoop(
  agentName: string,
  persona: string,
  tools: DynamicStructuredTool[],
  state: typeofAiGraphState,
): Promise<Partial<typeofAiGraphState>> {
  aiLogger.info(`Executing ${agentName} Agent`, state.context);
  const provider = getProvider();

  const queryMessage = state.messages && state.messages.length > 0 ? state.messages[state.messages.length - 1]?.content || '' : '';
  const toolDescriptions = tools.map((t: any) => `- ${t.name}: ${t.description}`).join('\n');

  const messages: AiMessage[] = [
    {
      role: 'system',
      content: `${persona}
You must reason through the problem step-by-step.

Available Tools:
${toolDescriptions}

Instructions:
1. Always output valid JSON matching the exact schema requested.
2. If you need more information, set action to "call_tool", provide the "toolName" and "toolArgs".
3. If you have gathered enough information to fulfill the user's request, set action to "final_answer", and provide "finalFacts", "finalCitations", and "confidenceScore".
4. Base your final answer purely on tool outputs.`,
    },
    {
      role: 'user',
      content: `User Query: ${queryMessage}\nPrevious Context: ${JSON.stringify(state.context)}`,
    }
  ];

  let iterations = 0;
  const MAX_ITERATIONS = 5;

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    aiLogger.info(`${agentName} Agent turn ${iterations}`, state.context);

    try {
      const response = await provider.generateStructuredJson<AgentAction>(
        messages,
        agentActionJsonSchema,
        { temperature: 0.1 },
        state.context
      );

      const decision = response.data;
      aiLogger.info(`Agent Decision: ${decision.action}`, state.context, { thought: decision.thought });

      if (decision.action === 'final_answer') {
        return {
          evidence: [{
            sourceAgent: agentName.toLowerCase(),
            facts: decision.finalFacts || [],
            citations: decision.finalCitations || [],
          }],
        };
      } else if (decision.action === 'call_tool' && decision.toolName) {
        const tool = tools.find((t: any) => t.name === decision.toolName);
        
        if (!tool) {
          messages.push({
            role: 'user',
            content: `Tool Error: Tool "${decision.toolName}" does not exist. Available tools: ${tools.map((t: any) => t.name).join(', ')}`,
          });
          continue;
        }

        aiLogger.info(`Executing tool: ${tool.name}`, state.context, { args: decision.toolArgs });
        
        if (!ToolAuthGuard.isAuthorized(tool.name, state.context)) {
          aiLogger.warn(`Tool Access Denied: User unauthorized for ${tool.name}`, state.context);
          messages.push({
            role: 'user',
            content: `Tool Error: Security Violation. You do not have permission to execute the tool "${tool.name}". Proceed without this tool or end execution.`,
          });
          continue;
        }

        try {
          const resultString = await (tool as any).invoke(decision.toolArgs || {});
          
          messages.push({
            role: 'assistant',
            content: `Called ${tool.name} with ${JSON.stringify(decision.toolArgs)}`,
          });
          
          messages.push({
            role: 'user',
            content: `Tool Result for ${tool.name}: \n${resultString}`,
          });
        } catch (e: any) {
          messages.push({
            role: 'user',
            content: `Tool Error during ${tool.name}: ${e.message}`,
          });
        }
      } else {
         messages.push({
            role: 'user',
            content: `Tool Error: You selected 'call_tool' but didn't provide a valid 'toolName'.`,
          });
      }
    } catch (error: any) {
      aiLogger.warn(`${agentName} Agent generation failed: ${error.message}`, state.context);
      break; 
    }
  }

  aiLogger.warn(`${agentName} Agent reached max iterations or errored out. Returning fallback.`, state.context);
  return {
    evidence: [{
      sourceAgent: agentName.toLowerCase(),
      facts: [`${agentName} agent halted due to max iterations or error before reaching a final conclusion.`],
      citations: [],
    }],
  };
}
