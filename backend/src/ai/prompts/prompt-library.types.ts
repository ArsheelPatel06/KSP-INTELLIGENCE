import type { PromptReference } from '../core/prompts/prompt-manager.interface';

export type AiPromptKey =
  | 'system'
  | 'investigation'
  | 'legal'
  | 'analytics'
  | 'graph'
  | 'recommendation'
  | 'report'
  | 'supervisor'
  | 'translation'
  | 'voice';

export interface AiPromptExample {
  input: string;
  expectedBehavior: string[];
}

export interface AiPromptOutputFormat {
  formatName: string;
  requiredSections: string[];
  notes?: string[];
}

export interface AiPromptDefinition {
  key: AiPromptKey;
  reference: PromptReference;
  role: string;
  instructions: string[];
  outputFormat: AiPromptOutputFormat;
  guardrails: string[];
  examples: AiPromptExample[];
  variables?: string[];
}
