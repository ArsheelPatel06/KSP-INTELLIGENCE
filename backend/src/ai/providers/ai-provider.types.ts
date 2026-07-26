export type AiProviderName = 'ollama' | 'mock';

export type AiProviderCapability =
  | 'text_generation'
  | 'structured_generation'
  | 'embedding_generation'
  | 'translation'
  | 'speech_to_text'
  | 'text_to_speech';

export interface AiProviderUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
}

export interface AiProviderResponse<TData = string> {
  data: TData;
  modelName: string;
  provider: AiProviderName;
  usage?: AiProviderUsage;
  rawMetadata?: Record<string, unknown>;
}
