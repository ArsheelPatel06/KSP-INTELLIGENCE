import type { RagPipeline, RagPipelineDependencies, RagPipelineResult, RagArchitectureDefinition } from '../rag-pipeline.interface';
import type { RagQuery } from '../rag.types';
import { aiLogger } from '../../shared/ai-logger';
import { RAG_COLLECTIONS } from '../collections';

export class StandardRagPipeline implements RagPipeline {
  public readonly architecture: RagArchitectureDefinition;

  constructor(public readonly dependencies: RagPipelineDependencies) {
    this.architecture = {
      collections: RAG_COLLECTIONS.map(c => c.name),
      supportsHybridRetrieval: false, // Currently semantic only
      supportsCitationEngine: true,
      supportsReranking: true,
      supportsPromptAssembly: true,
      supportsCache: !!dependencies.cache,
    };
  }

  public async retrieve(query: RagQuery): Promise<RagPipelineResult> {
    const startTime = Date.now();
    let retrievedResult;
    
    // 1. Check Cache
    if (this.dependencies.cache) {
      const cacheKey = this.dependencies.cache.makeKey(query);
      const cachedEntry = await this.dependencies.cache.get(cacheKey);
      if (cachedEntry) {
        aiLogger.info('RAG Pipeline cache hit', query.context, { 
          queryText: query.query 
        });
        retrievedResult = cachedEntry.result;
      }
    }
    
    // 2. Retrieve
    if (!retrievedResult) {
      retrievedResult = await this.dependencies.retriever.retrieve(query);
      
      // Save to cache
      if (this.dependencies.cache) {
        const cacheKey = this.dependencies.cache.makeKey(query);
        await this.dependencies.cache.set(cacheKey, {
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour
          result: retrievedResult,
        });
      }
    }

    // 3. Rerank
    const rerankedResult = await this.dependencies.reranker.rerank(query, retrievedResult.mergedResults);
    
    // 4. Build Citations
    const citationResult = await this.dependencies.citationEngine.buildCitations(rerankedResult.reranked);
    
    // 5. Build Context Window
    const contextWindow = await this.dependencies.contextBuilder.build({
      query,
      chunks: rerankedResult.reranked,
      citations: citationResult.citations,
    });
    
    // 6. Assemble Prompt Context (Optional, for full LLM execution)
    const promptContext = await this.dependencies.promptBuilder.build({
      query,
      contextWindow,
      systemInstructionsKey: 'default_rag_prompt',
    });

    aiLogger.info('RAG Pipeline execution completed', query.context, {
      chunksRetrieved: retrievedResult.mergedResults.length,
      chunksReranked: rerankedResult.reranked.length,
    });

    return {
      retrieved: retrievedResult,
      reranked: rerankedResult.reranked,
      contextWindow,
      promptContext,
    };
  }
}
