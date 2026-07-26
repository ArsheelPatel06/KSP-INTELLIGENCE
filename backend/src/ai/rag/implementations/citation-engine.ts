import type { RagCitationEngine, RagCitationBuildResult } from '../citation-engine.interface';
import type { RagRetrievedChunk, RagCitation } from '../rag.types';

export class DefaultCitationEngine implements RagCitationEngine {
  public async buildCitations(chunks: readonly RagRetrievedChunk[]): Promise<RagCitationBuildResult> {
    const citations: RagCitation[] = [];
    const seenDocumentIds = new Set<string>();

    for (const chunk of chunks) {
      if (!seenDocumentIds.has(chunk.chunk.metadata.documentId)) {
        seenDocumentIds.add(chunk.chunk.metadata.documentId);
        citations.push({
          citationId: `cite_${chunk.chunk.metadata.chunkId}`,
          source: {
            sourceType: 'document',
            sourceId: chunk.chunk.metadata.documentId,
            label: chunk.chunk.metadata.sourceTitle,
          },
          chunkId: chunk.chunk.metadata.chunkId,
          excerpt: chunk.chunk.text,
          relevanceScore: chunk.finalScore,
        });
      }
    }

    return {
      citations,
      duplicateSourceIdsRemoved: Array.from(seenDocumentIds),
    };
  }
}
