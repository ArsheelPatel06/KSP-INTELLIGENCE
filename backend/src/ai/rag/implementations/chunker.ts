import type { 
  RagChunker, 
  RagChunkerInput, 
  RagChunkerOutput, 
  RagChunkingStrategyDefinition 
} from '../chunking.interface';
import type { RagCollectionName, RagChunk } from '../rag.types';
import { RAG_COLLECTIONS } from '../collections';

export class StandardChunker implements RagChunker {
  
  public getStrategy(collection: RagCollectionName): RagChunkingStrategyDefinition {
    // Look up the default chunking strategy for this collection from collections.ts
    const def = RAG_COLLECTIONS.find(c => c.name === collection);
    
    return {
      collection,
      purpose: def?.purpose || 'General Chunking',
      rule: {
        maxTokensPerChunk: 512,
        overlapTokens: 50,
        preserveHeadings: true,
        preserveTables: false,
        preserveSectionIdentifiers: true,
        splitOnParagraphsFirst: true,
      }
    };
  }

  public async chunk(input: RagChunkerInput): Promise<RagChunkerOutput> {
    const strategy = this.getStrategy(input.metadata.collection);
    const { maxTokensPerChunk, overlapTokens } = strategy.rule;
    
    // Very basic Recursive Character Text Splitting (mocked for speed in on-prem)
    // In production, use @langchain/textsplitters RecursiveCharacterTextSplitter.
    
    const paragraphs = input.rawText.split('\n\n').filter(p => p.trim().length > 0);
    const chunks: RagChunk[] = [];
    
    let currentChunkText = '';
    let currentStartIndex = 0;
    
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const pTokens = Math.ceil((p?.length || 0) / 4);
      const currentTokens = Math.ceil((currentChunkText?.length || 0) / 4);
      
      if (currentTokens + pTokens > maxTokensPerChunk && currentChunkText.length > 0) {
        chunks.push(this.createChunk(currentChunkText, input, chunks.length, currentStartIndex));
        
        // Handling overlap by keeping the last paragraph
        currentChunkText = paragraphs[i - 1] ? (paragraphs[i - 1] + '\n\n' + (p || '')) : (p || '');
        currentStartIndex = i - 1 >= 0 ? i - 1 : i;
      } else {
        currentChunkText += (currentChunkText.length > 0 ? '\n\n' : '') + p;
      }
    }
    
    if (currentChunkText.length > 0) {
      chunks.push(this.createChunk(currentChunkText, input, chunks.length, currentStartIndex));
    }

    return {
      chunks,
      estimatedTokenCount: chunks.reduce((acc, c) => acc + (c.metadata.tokenCount || 0), 0),
      warnings: [],
    };
  }
  
  private createChunk(text: string, input: RagChunkerInput, index: number, startIndex: number): RagChunk {
    return {
      text,
      metadata: {
        ...input.metadata,
        chunkId: `${input.documentId}_chunk_${index}`,
        chunkIndex: index,
        chunkingStrategy: 'by_topic',
        tokenCount: Math.ceil(text.length / 4), // Fast heuristic
      },
    };
  }
}
