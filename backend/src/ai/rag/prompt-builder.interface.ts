import type { RagContextWindow, RagPromptContext, RagQuery } from './rag.types';

export interface RagPromptBuilderInput {
  query: RagQuery;
  contextWindow: RagContextWindow;
  systemInstructionsKey: string;
}

export interface RagPromptBuilder {
  build(input: RagPromptBuilderInput): Promise<RagPromptContext>;
}
