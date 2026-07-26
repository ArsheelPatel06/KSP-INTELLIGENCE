import type { AiProviderCapability, AiProviderName, AiProviderResponse } from './ai-provider.types';
import type { AiRequestContext } from '../shared/ai-request.types';

export interface AiGenerationOptions {
  model?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stopSequences?: string[];
  systemPrompt?: string;
}

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiProvider {
  readonly name: AiProviderName;
  readonly capabilities: readonly AiProviderCapability[];
  
  generateText(
    messages: AiMessage[],
    options: AiGenerationOptions,
    context: AiRequestContext
  ): Promise<AiProviderResponse<string>>;
  
  generateStructuredJson<TData>(
    messages: AiMessage[],
    jsonSchema: Record<string, unknown>,
    options: AiGenerationOptions,
    context: AiRequestContext
  ): Promise<AiProviderResponse<TData>>;
  
  streamText(
    messages: AiMessage[],
    options: AiGenerationOptions,
    context: AiRequestContext,
    onChunk: (chunk: string) => void
  ): Promise<AiProviderResponse<string>>;
  
  healthCheck(): Promise<boolean>;
}
