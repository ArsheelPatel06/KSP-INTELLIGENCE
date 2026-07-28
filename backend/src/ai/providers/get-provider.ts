import { aiConfig } from '../config/ai-config';
import { OllamaProvider } from './ollama-provider';
import { GroqProvider } from './groq-provider';

let providerInstance: any = null;

export function getProvider() {
  if (providerInstance) return providerInstance;
  if (aiConfig.provider === 'groq') {
    providerInstance = new GroqProvider();
  } else {
    providerInstance = new OllamaProvider();
  }
  return providerInstance;
}
