import type { 
  RagEmbedder, 
  RagEmbeddingModelProfile, 
  RagChunkEmbeddingRequest, 
  RagQueryEmbeddingRequest, 
  RagEmbeddingVector 
} from '../embedding.interface';
import type { RagCollectionName } from '../rag.types';
import ollama from 'ollama';

export class OllamaEmbedder implements RagEmbedder {
  private readonly modelName = 'nomic-embed-text'; // standard fast local embedding model

  public getModelProfile(collection: RagCollectionName): RagEmbeddingModelProfile {
    return {
      provider: 'ollama',
      model: this.modelName,
      dimensions: 768, // standard for nomic-embed-text
      normalized: true,
      purpose: 'legal_reasoning', // default
      supportedCollections: [collection],
    };
  }

  public async embedChunk(input: RagChunkEmbeddingRequest): Promise<RagEmbeddingVector> {
    const response = await ollama.embeddings({
      model: this.modelName,
      prompt: input.chunk.text,
    });

    return {
      vector: response.embedding,
      dimensions: response.embedding.length,
      model: this.modelName,
    };
  }

  public async embedQuery(input: RagQueryEmbeddingRequest): Promise<RagEmbeddingVector> {
    const response = await ollama.embeddings({
      model: this.modelName,
      prompt: input.query.query,
    });

    return {
      vector: response.embedding,
      dimensions: response.embedding.length,
      model: this.modelName,
    };
  }
}
