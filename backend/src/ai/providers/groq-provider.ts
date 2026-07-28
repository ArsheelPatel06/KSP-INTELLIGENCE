import Groq from 'groq-sdk';
import type { AiProvider, AiGenerationOptions, AiMessage } from './ai-provider.interface';
import type { AiProviderCapability, AiProviderName, AiProviderResponse } from './ai-provider.types';
import type { AiRequestContext } from '../shared/ai-request.types';
import { aiConfig } from '../config/ai-config';
import { aiLogger } from '../shared/ai-logger';
import { AiTimeoutError, AiProviderError } from '../shared/ai-errors';

export class GroqProvider implements AiProvider {
  public readonly name: AiProviderName = 'groq' as AiProviderName;
  public readonly capabilities: readonly AiProviderCapability[] = [
    'text_generation',
    'structured_generation',
  ];

  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: aiConfig.groq.apiKey,
    });
  }

  public async generateText(
    messages: AiMessage[],
    options: AiGenerationOptions,
    context: AiRequestContext
  ): Promise<AiProviderResponse<string>> {
    const startTime = Date.now();
    const model = options.model || aiConfig.groq.defaultModel;

    try {
      const response = await this.executeWithRetry(async () => {
        return this.client.chat.completions.create({
          model,
          messages: messages as any,
          temperature: options.temperature ?? aiConfig.generation.defaultTemperature,
          top_p: options.topP ?? aiConfig.generation.defaultTopP,
          stop: options.stopSequences,
        });
      }, context);

      const durationMs = Date.now() - startTime;
      const usage = {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
        latencyMs: durationMs,
      };

      aiLogger.logUsage(context, usage, durationMs);

      return {
        data: response.choices[0]?.message?.content || '',
        modelName: model,
        provider: this.name,
        usage,
      };
    } catch (error: any) {
      aiLogger.error('Groq generation failed', error, context, { model });
      throw new AiProviderError('Failed to generate text from Groq', { originalError: error.message });
    }
  }

  public async generateStructuredJson<TData>(
    messages: AiMessage[],
    jsonSchema: Record<string, unknown>,
    options: AiGenerationOptions,
    context: AiRequestContext
  ): Promise<AiProviderResponse<TData>> {
    const startTime = Date.now();
    const model = options.model || aiConfig.groq.defaultModel;

    try {
      const modifiedMessages = [...messages];
      if (modifiedMessages[0]?.role === 'system') {
        modifiedMessages[0].content += `\n\nYou MUST return your response as a valid JSON object matching this schema: ${JSON.stringify(jsonSchema)}`;
      } else {
        modifiedMessages.unshift({ role: 'system', content: `You MUST return your response as a valid JSON object matching this schema: ${JSON.stringify(jsonSchema)}` });
      }

      const response = await this.executeWithRetry(async () => {
        return this.client.chat.completions.create({
          model,
          messages: modifiedMessages as any,
          temperature: options.temperature ?? aiConfig.generation.defaultTemperature,
          top_p: options.topP ?? aiConfig.generation.defaultTopP,
          response_format: { type: 'json_object' },
        });
      }, context);

      const durationMs = Date.now() - startTime;
      const usage = {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
        latencyMs: durationMs,
      };

      aiLogger.logUsage(context, usage, durationMs);

      let cleanContent = response.choices[0]?.message?.content?.trim() || '{}';
      const parsedData = JSON.parse(cleanContent) as TData;

      return {
        data: parsedData,
        modelName: model,
        provider: this.name,
        usage,
      };
    } catch (error: any) {
      aiLogger.error('Groq structured generation failed', error, context, { model });
      throw new AiProviderError('Failed to generate structured JSON from Groq', { originalError: error.message });
    }
  }

  public async streamText(
    messages: AiMessage[],
    options: AiGenerationOptions,
    context: AiRequestContext,
    onChunk: (chunk: string) => void
  ): Promise<AiProviderResponse<string>> {
    const startTime = Date.now();
    const model = options.model || aiConfig.groq.defaultModel;

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: messages as any,
        stream: true,
        temperature: options.temperature ?? aiConfig.generation.defaultTemperature,
        top_p: options.topP ?? aiConfig.generation.defaultTopP,
      });

      let fullText = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullText += content;
          onChunk(content);
        }
      }

      const durationMs = Date.now() - startTime;
      const usage = {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
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
      aiLogger.error('Groq streaming failed', error, context, { model });
      throw new AiProviderError('Failed to stream text from Groq', { originalError: error.message });
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const models = await this.client.models.list();
      return !!models.data.length;
    } catch (error) {
      aiLogger.error('Groq health check failed', error as Error);
      return false;
    }
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: AiRequestContext,
    retries = aiConfig.groq.maxRetries
  ): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;
        const isRateLimit = error.status === 429;
        
        if (attempt >= retries) {
          throw error;
        }
        
        aiLogger.warn(`Groq request failed, retrying (${attempt}/${retries})`, context, { error: error.message });
        await new Promise((res) => setTimeout(res, (isRateLimit ? 2000 : 1000) * Math.pow(2, attempt))); 
      }
    }
    throw new Error('Unreachable');
  }
}
