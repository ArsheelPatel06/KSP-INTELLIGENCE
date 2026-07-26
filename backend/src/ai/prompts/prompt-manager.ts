import { AI_PROMPT_LIBRARY } from './prompt-library';
import { aiLogger } from '../../shared/ai-logger';

export class PromptManager {
  /**
   * Fetch a specific prompt template by key
   */
  public getPromptTemplate(key: string) {
    const template = AI_PROMPT_LIBRARY[key];
    if (!template) {
      aiLogger.warn(`Prompt template not found for key: ${key}`, null, { requestedKey: key });
      return null;
    }
    return template;
  }

  /**
   * Build the prompt string by replacing variables in the template instructions
   */
  public buildPrompt(key: string, variables: Record<string, string>): string {
    const template = this.getPromptTemplate(key);
    const def = this.getPromptTemplate(key);
    
    if (!def) {
      // Fallback if missing
      return `System Role: Specialized AI Agent.\nContext Variables: ${JSON.stringify(variables)}`;
    }

    const renderedInstructions = def.instructions.map(i => `- ${i}`).join('\n');
    const guardrails = def.guardrails.length > 0 ? `\n\nGuardrails:\n${def.guardrails.map(g => `- ${g}`).join('\n')}` : '';

    let fullPrompt = `
You are ${def.role}.

${renderedInstructions}

${guardrails}
    `.trim();

    for (const [varName, varValue] of Object.entries(variables)) {
      const regex = new RegExp(`{{${varName}}}`, 'g');
      fullPrompt = fullPrompt.replace(regex, varValue);
    }

    return fullPrompt;
  }
}

export const promptManager = new PromptManager();
