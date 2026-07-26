import { AiError } from '../core/errors/ai-error';
import type { AiProvider } from './ai-provider.interface';
import type { AiProviderName } from './ai-provider.types';

/**
 * Runtime registry for AI providers.
 *
 * This factory avoids hard-coding provider implementations into orchestrators.
 * Later phases can register Gemini, OpenAI, or mock adapters during bootstrap.
 */
export class AiProviderFactory {
  private readonly registry = new Map<AiProviderName, AiProvider>();

  register(provider: AiProvider): void {
    this.registry.set(provider.name, provider);
  }

  has(name: AiProviderName): boolean {
    return this.registry.has(name);
  }

  resolve(name: AiProviderName): AiProvider {
    const provider = this.registry.get(name);
    if (!provider) {
      throw new AiError(`AI provider ${name} has not been registered`, 'AI_CONFIGURATION_ERROR', {
        provider: name,
      });
    }

    return provider;
  }

  list(): AiProviderName[] {
    return [...this.registry.keys()];
  }
}
