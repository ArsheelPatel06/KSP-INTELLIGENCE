import type { RagCache } from './cache.interface';
import type { RagCitationEngine } from './citation-engine.interface';
import type { RagChunker } from './chunking.interface';
import type { RagContextBuilder } from './context-builder.interface';
import type { RagEmbedder } from './embedding.interface';
import type { RagPromptBuilder } from './prompt-builder.interface';
import type { RagQuery, RagContextWindow, RagPromptContext, RagRetrievedChunk } from './rag.types';
import type { RagReranker } from './reranker.interface';
import type { RagRetriever, RagRetrieverResult } from './retriever.interface';
import type { RagVectorStore } from './vector-store.interface';

export interface RagArchitectureDefinition {
  collections: readonly string[];
  supportsHybridRetrieval: boolean;
  supportsCitationEngine: boolean;
  supportsReranking: boolean;
  supportsPromptAssembly: boolean;
  supportsCache: boolean;
}

export interface RagPipelineDependencies {
  chunker: RagChunker;
  embedder: RagEmbedder;
  vectorStore: RagVectorStore;
  retriever: RagRetriever;
  reranker: RagReranker;
  citationEngine: RagCitationEngine;
  contextBuilder: RagContextBuilder;
  promptBuilder: RagPromptBuilder;
  cache?: RagCache;
}

export interface RagPipelineResult {
  retrieved: RagRetrieverResult;
  reranked: RagRetrievedChunk[];
  contextWindow: RagContextWindow;
  promptContext: RagPromptContext;
}

export interface RagPipeline {
  readonly architecture: RagArchitectureDefinition;
  readonly dependencies: RagPipelineDependencies;
  retrieve(query: RagQuery): Promise<RagPipelineResult>;
}
