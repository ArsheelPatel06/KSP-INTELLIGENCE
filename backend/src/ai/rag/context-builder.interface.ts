import type { AiWarning } from '../shared/ai-result.types';
import type { RagCitation, RagContextWindow, RagQuery, RagRetrievedChunk } from './rag.types';

export interface RagContextBuilderInput {
  query: RagQuery;
  chunks: readonly RagRetrievedChunk[];
  citations: readonly RagCitation[];
  warnings?: readonly AiWarning[];
}

export interface RagContextBuilder {
  build(input: RagContextBuilderInput): Promise<RagContextWindow>;
}
