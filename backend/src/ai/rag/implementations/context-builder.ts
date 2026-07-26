import type { RagContextBuilder, RagContextBuilderInput } from '../context-builder.interface';
import type { RagContextWindow } from '../rag.types';

export class StandardContextBuilder implements RagContextBuilder {
  
  public async build(input: RagContextBuilderInput): Promise<RagContextWindow> {
    const formattedText = input.chunks.map(chunk => {
      return `[Source: ${chunk.chunk.metadata.collection} | Doc: ${chunk.chunk.metadata.documentId} | Relevance: ${(chunk.finalScore * 100).toFixed(1)}%]\n${chunk.chunk.text}`;
    }).join('\n\n---\n\n');

    return {
      collectionOrder: [],
      querySummary: input.query.query,
      chunks: [...input.chunks],
      citations: [...input.citations],
      warnings: [],
      totalEstimatedTokens: input.chunks.reduce((acc, c) => acc + (c.chunk.metadata.tokenCount || Math.ceil(c.chunk.text.length / 4)), 0),
    };
  }
}
