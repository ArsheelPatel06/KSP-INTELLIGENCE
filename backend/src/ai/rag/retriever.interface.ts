import type { RagCollectionName, RagQuery, RagRetrievedChunk } from './rag.types';

export interface RagCollectionSelectionResult {
  selectedCollections: RagCollectionName[];
  reasons: string[];
}

export interface RagLexicalRetrieverResult {
  chunks: RagRetrievedChunk[];
  queryTerms: string[];
}

export interface RagSemanticRetrieverResult {
  chunks: RagRetrievedChunk[];
  embeddingModel: string;
}

export interface RagRetrieverResult {
  selectedCollections: RagCollectionName[];
  lexicalResults?: RagLexicalRetrieverResult;
  semanticResults?: RagSemanticRetrieverResult;
  mergedResults: RagRetrievedChunk[];
}

export interface RagRetriever {
  selectCollections(query: RagQuery): Promise<RagCollectionSelectionResult>;
  retrieve(query: RagQuery): Promise<RagRetrieverResult>;
}
