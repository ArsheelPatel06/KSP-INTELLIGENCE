import { Ollama } from 'ollama';
import type { AiProvider, AiGenerationOptions, AiMessage } from './ai-provider.interface';
import type { AiProviderCapability, AiProviderName, AiProviderResponse } from './ai-provider.types';
import type { AiRequestContext } from '../shared/ai-request.types';
import { aiConfig } from '../config/ai-config';
import { aiLogger } from '../shared/ai-logger';
import { AiTimeoutError, AiProviderError } from '../shared/ai-errors';

export class OllamaProvider implements AiProvider {
  public readonly name: AiProviderName = 'ollama';
  public readonly capabilities: readonly AiProviderCapability[] = [
    'text_generation',
    'structured_generation',
  ];

  private client: Ollama;

  constructor() {
    this.client = new Ollama({ host: aiConfig.ollama.baseUrl });
  }

  public async generateText(
    messages: AiMessage[],
    options: AiGenerationOptions,
    context: AiRequestContext
  ): Promise<AiProviderResponse<string>> {
    const startTime = Date.now();
    const model = options.model || aiConfig.ollama.defaultModel;

    try {
      const response = await this.executeWithRetry(async () => {
        return this.client.chat({
          model,
          messages,
          options: {
            temperature: options.temperature ?? aiConfig.generation.defaultTemperature,
            top_p: options.topP ?? aiConfig.generation.defaultTopP,
            stop: options.stopSequences,
          },
        });
      }, context);

      const durationMs = Date.now() - startTime;
      const usage = {
        inputTokens: response.prompt_eval_count || 0,
        outputTokens: response.eval_count || 0,
        totalTokens: (response.prompt_eval_count || 0) + (response.eval_count || 0),
        latencyMs: durationMs,
      };

      aiLogger.logUsage(context, usage, durationMs);

      return {
        data: response.message.content,
        modelName: model,
        provider: this.name,
        usage,
        rawMetadata: {
          eval_duration: response.eval_duration,
          load_duration: response.load_duration,
        },
      };
    } catch (error: any) {
      aiLogger.error('Ollama generation failed', error, context, { model });
      throw new AiProviderError('Failed to generate text from Ollama', { originalError: error.message });
    }
  }

  public async generateStructuredJson<TData>(
    messages: AiMessage[],
    jsonSchema: Record<string, unknown>,
    options: AiGenerationOptions,
    context: AiRequestContext
  ): Promise<AiProviderResponse<TData>> {
    const startTime = Date.now();
    const model = options.model || aiConfig.ollama.defaultModel;

    try {
      const response = await this.executeWithRetry(async () => {
        return this.client.chat({
          model,
          messages,
          format: jsonSchema as any, // Ollama accepts JSON schema objects for structured output
          options: {
            temperature: options.temperature ?? aiConfig.generation.defaultTemperature,
            top_p: options.topP ?? aiConfig.generation.defaultTopP,
          },
        });
      }, context);

      const durationMs = Date.now() - startTime;
      const usage = {
        inputTokens: response.prompt_eval_count || 0,
        outputTokens: response.eval_count || 0,
        totalTokens: (response.prompt_eval_count || 0) + (response.eval_count || 0),
        latencyMs: durationMs,
      };

      aiLogger.logUsage(context, usage, durationMs);

      return {
        data: JSON.parse(response.message.content) as TData,
        modelName: model,
        provider: this.name,
        usage,
      };
    } catch (error: any) {
      aiLogger.error('Ollama structured generation failed', error, context, { model });
      throw new AiProviderError('Failed to generate structured JSON from Ollama', { originalError: error.message });
    }
  }

  public async streamText(
    messages: AiMessage[],
    options: AiGenerationOptions,
    context: AiRequestContext,
    onChunk: (chunk: string) => void
  ): Promise<AiProviderResponse<string>> {
    const startTime = Date.now();
    const model = options.model || aiConfig.ollama.defaultModel;

    try {
      const stream = await this.client.chat({
        model,
        messages,
        stream: true,
        options: {
          temperature: options.temperature ?? aiConfig.generation.defaultTemperature,
          top_p: options.topP ?? aiConfig.generation.defaultTopP,
        },
      });

      let fullText = '';
      let evalCount = 0;
      let promptEvalCount = 0;

      for await (const chunk of stream) {
        if (chunk.message?.content) {
          fullText += chunk.message.content;
          onChunk(chunk.message.content);
        }
        if (chunk.done) {
          evalCount = chunk.eval_count || 0;
          promptEvalCount = chunk.prompt_eval_count || 0;
        }
      }

      const durationMs = Date.now() - startTime;
      const usage = {
        inputTokens: promptEvalCount,
        outputTokens: evalCount,
        totalTokens: promptEvalCount + evalCount,
        latencyMs: durationMs,
      };

      aiLogger.logUsage(context, usage, durationMs);

      return {
        data: fullText,
        modelName: model,
        provider: this.name,
        usage,
      };
    } catch (error: any) {
      aiLogger.error('Ollama streaming failed', error, context, { model });
      throw new AiProviderError('Failed to stream text from Ollama', { originalError: error.message });
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      // Send a very basic prompt to verify inference engine is hot.
      const response = await this.client.generate({
        model: aiConfig.ollama.defaultModel,
        prompt: 'test',
        options: { num_predict: 1 },
      });
      return !!response;
    } catch (error) {
      aiLogger.error('Ollama health check failed', error as Error);
      return false;
    }
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: AiRequestContext,
    retries = aiConfig.ollama.maxRetries
  ): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;
        const isTimeout = error.message?.includes('fetch failed') || error.message?.includes('timeout');
        
        if (attempt >= retries || !isTimeout) {
          if (isTimeout) throw new AiTimeoutError('Ollama request timed out after retries');
          throw error;
        }
        
        aiLogger.warn(`Ollama request failed, retrying (${attempt}/${retries})`, context, { error: error.message });
        await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt))); // Exponential backoff
      }
    }
    throw new Error('Unreachable');
  }
}
