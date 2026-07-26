import type { 
  RagRetriever, 
  RagCollectionSelectionResult, 
  RagRetrieverResult 
} from '../retriever.interface';
import type { RagQuery, RagCollectionName, RagRetrievedChunk } from '../rag.types';
import type { RagEmbedder } from '../embedding.interface';
import type { RagVectorStore } from '../vector-store.interface';
import { RAG_COLLECTIONS } from '../collections';

export class HybridRetriever implements RagRetriever {
  constructor(
    private readonly embedder: RagEmbedder,
    private readonly vectorStore: RagVectorStore
  ) {}

  public async selectCollections(query: RagQuery): Promise<RagCollectionSelectionResult> {
    if (query.filters?.collections && query.filters.collections.length > 0) {
      return {
        selectedCollections: [...query.filters.collections],
        reasons: ['Explicitly specified in query filters'],
      };
    }
    
    // In production, this might use an LLM or intent classifier.
    // For now, return a default broad search
    return {
      selectedCollections: ['legal', 'fir', 'police_sop'],
      reasons: ['Fallback to broad search'],
    };
  }

  public async retrieve(query: RagQuery): Promise<RagRetrieverResult> {
    const { selectedCollections } = await this.selectCollections(query);
    
    // 1. Get embedding for the query
    const queryEmbedding = await this.embedder.embedQuery({
      query,
      collections: selectedCollections,
    });
    
    // 2. Search each collection
    const allChunks: RagRetrievedChunk[] = [];
    for (const collection of selectedCollections) {
      const chunks = await this.vectorStore.search({
        collection,
        queryEmbedding,
        filter: query.filters, // Optional filtering based on caseMasterId, etc.
        topK: query.topK || 5,
      });
      allChunks.push(...chunks);
    }
    
    // Sort all collected chunks globally by score
    allChunks.sort((a, b) => b.finalScore - a.finalScore);
    
    // Cap to global topK
    const finalChunks = allChunks.slice(0, query.topK || 5);

    return {
      selectedCollections,
      semanticResults: {
        chunks: finalChunks,
        embeddingModel: queryEmbedding.model,
      },
      mergedResults: finalChunks, // Semantic only for this implementation
    };
  }
}
