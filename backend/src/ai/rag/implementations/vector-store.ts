import type { 
  RagVectorStore, 
  RagVectorStoreUpsertRecord, 
  RagVectorStoreSearchRequest 
} from '../vector-store.interface';
import type { RagCollectionName, RagRetrievedChunk } from '../rag.types';
import { aiLogger } from '../../shared/ai-logger';

export class InMemoryVectorStore implements RagVectorStore {
  // Store is collection -> array of records
  private store: Map<RagCollectionName, RagVectorStoreUpsertRecord[]> = new Map();

  public async upsert(records: readonly RagVectorStoreUpsertRecord[]): Promise<void> {
    for (const record of records) {
      const col = record.chunk.metadata.collection;
      if (!this.store.has(col)) {
        this.store.set(col, []);
      }
      
      const colStore = this.store.get(col)!;
      // Overwrite if chunkId exists
      const existingIndex = colStore.findIndex(r => r.chunk.metadata.chunkId === record.chunk.metadata.chunkId);
      if (existingIndex >= 0) {
        colStore[existingIndex] = record;
      } else {
        colStore.push(record);
      }
    }
  }

  public async search(request: RagVectorStoreSearchRequest): Promise<RagRetrievedChunk[]> {
    const colStore = this.store.get(request.collection);
    if (!colStore || colStore.length === 0) {
      return [];
    }

    const queryVec = request.queryEmbedding.vector;
    
    // Calculate cosine similarities
    const scoredChunks = colStore.map(record => {
      const sim = this.cosineSimilarity(queryVec, record.embedding.vector);
      return {
        chunk: record.chunk,
        score: sim
      };
    });

    // Sort by descending score
    scoredChunks.sort((a, b) => b.score - a.score);

    // Apply filtering if provided
    let filteredChunks = scoredChunks;
    if (request.filter) {
      if (request.filter.caseMasterIds && request.filter.caseMasterIds.length > 0) {
        filteredChunks = filteredChunks.filter(r => request.filter?.caseMasterIds?.includes(r.chunk.metadata.caseMasterId!));
      }
      if (request.filter.actCodes && request.filter.actCodes.length > 0) {
        filteredChunks = filteredChunks.filter(r => request.filter?.actCodes?.includes(r.chunk.metadata.actCode!));
      }
    }

    // Top K
    const topK = filteredChunks.slice(0, request.topK);

    return topK.map(r => ({
      chunk: r.chunk,
      finalScore: r.score,
      reasons: ['Semantic match'],
    }));
  }

  public async deleteByDocumentId(collection: RagCollectionName, documentId: string, context?: any): Promise<void> {
    const colStore = this.store.get(collection);
    if (colStore) {
      const filtered = colStore.filter(r => r.chunk.metadata.documentId !== documentId);
      this.store.set(collection, filtered);
      aiLogger.info(`Deleted document ${documentId} from collection ${collection}`, context, { documentId });
    }
  }

  private cosineSimilarity(vecA: number[] | undefined, vecB: number[] | undefined): number {
    if (!vecA || !vecB) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(vecA.length, vecB.length);
    for (let i = 0; i < len; i++) {
      const a = vecA[i] || 0;
      const b = vecB[i] || 0;
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
