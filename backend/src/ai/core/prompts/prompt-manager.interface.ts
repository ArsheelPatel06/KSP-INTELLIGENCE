export interface PromptReference {
  namespace: string;
  name: string;
  version: string;
}

export interface PromptTemplate {
  reference: PromptReference;
  description?: string;
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * Prompt management contract.
 *
 * Phase 1 defines the prompt-management boundary without shipping any prompt
 * content. Future phases can plug file-backed, database-backed, or versioned
 * prompt registries into this interface.
 */
export interface PromptManager {
  get(reference: PromptReference): Promise<PromptTemplate>;
  exists(reference: PromptReference): Promise<boolean>;
}
