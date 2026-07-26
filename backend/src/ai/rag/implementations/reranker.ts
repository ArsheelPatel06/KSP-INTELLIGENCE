import type { RagReranker, RagRerankerResult } from '../reranker.interface';
import type { RagQuery, RagRetrievedChunk } from '../rag.types';

export class BasicReranker implements RagReranker {
  public async rerank(query: RagQuery, chunks: readonly RagRetrievedChunk[]): Promise<RagRerankerResult> {
    // Basic mock reranker. In production, this might use a cross-encoder model.
    // For now, we simply return the chunks sorted by their initial retrieval score,
    // applying a slight penalty to older documents.
    
    const reranked = [...chunks].sort((a, b) => b.finalScore - a.finalScore);
    
    return {
      reranked,
      appliedRules: [
        {
          name: 'Passthrough',
          description: 'Passes through semantic scores without cross-encoding.',
          weight: 1.0,
        }
      ]
    };
  }
}
