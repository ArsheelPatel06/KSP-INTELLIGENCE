import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiOrchestrator } from '../core/workflow/orchestrator';
import { HumanMessage } from '@langchain/core/messages';
import { OllamaProvider } from '../providers/ollama-provider';
import fs from 'fs';
import path from 'path';

// Mock OllamaProvider to avoid real LLM calls during regression tests
vi.mock('../providers/ollama-provider', () => {
  return {
    OllamaProvider: vi.fn().mockImplementation(() => ({
      generateStructuredJson: vi.fn().mockImplementation(async (messages, schema, options, context) => {
        // Simple heuristic mock based on prompt content
        const promptString = JSON.stringify(messages);
        
        if (promptString.includes('Intent Detection')) {
          return { data: { primaryIntent: 'investigation', confidenceScore: 0.9, requiredEntities: [] } };
        }
        if (promptString.includes('Entity Extraction')) {
          return { data: { entities: [] } };
        }
        if (promptString.includes('Supervisor')) {
          return { data: { 
            primaryIntent: 'investigation', 
            agentsToRun: ['investigation'], 
            executionMode: 'sequential', 
            clearanceGranted: true 
          } };
        }
        if (promptString.includes('Generator')) {
          return { data: { 
            summary: 'Mocked regression response', 
            reasoning: ['Mock step 1'], 
            evidence: ['Mock evidence'], 
            confidence: 0.9, 
            citations: ['FIR-123'], 
            recommendations: [], 
            relatedCases: [], 
            legalSections: [], 
            graph: {}, 
            analytics: {}, 
            warnings: [] 
          } };
        }
        if (promptString.includes('investigation') || promptString.includes('Investigation Agent')) {
          return { data: { action: 'final_answer', thought: 'Mock thought', finalFacts: ['Mock fact'], finalCitations: ['FIR-123'], confidenceScore: 0.9 } };
        }

        return { data: {} };
      })
    }))
  };
});

describe('AI Orchestrator Regression Suite', () => {
  const mockContext = {
    requestId: 'test-req',
    sessionId: 'test-session',
    user: { userId: 'u1', role: 'INVESTIGATOR' },
    channel: 'api' as const
  };

  it('should successfully route a standard investigation query end-to-end', async () => {
    const result = await aiOrchestrator.invoke(
      {
        messages: [new HumanMessage("What is the next step for case 1234?")],
        context: mockContext
      },
      { configurable: { thread_id: mockContext.sessionId } }
    );

    expect(result).toBeDefined();
    expect(result.permissions.clearanceGranted).toBe(true);
    expect(result.taskPlan.agentsToRun).toContain('investigation');
    expect(result.finalOutput).toBeDefined();
    expect(result.finalOutput.payload.summary).toBe('Mocked regression response');
    expect(result.finalOutput.payload.confidence).toBe(0.9);
  });
});
