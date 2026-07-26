import { bench, describe } from 'vitest';
import { aiOrchestrator } from '../core/workflow/orchestrator';
import { HumanMessage } from '@langchain/core/messages';
import { vi } from 'vitest';

// Mock the heavy LLM provider to isolate graph orchestrator overhead
vi.mock('../providers/ollama-provider', () => {
  return {
    OllamaProvider: vi.fn().mockImplementation(() => ({
      generateStructuredJson: vi.fn().mockResolvedValue({
        data: {
          primaryIntent: 'investigation',
          agentsToRun: ['investigation'],
          executionMode: 'sequential',
          clearanceGranted: true,
          summary: 'Benchmarked',
          reasoning: [],
          evidence: [],
          confidence: 1,
          citations: [],
          warnings: []
        }
      })
    }))
  };
});

describe('AI Orchestrator Latency Benchmarks', () => {
  const mockContext = {
    requestId: 'bench-req',
    sessionId: 'bench-session',
    user: { userId: 'u1', role: 'SUPERVISOR' },
    channel: 'api' as const
  };

  bench('Graph Routing Overhead (Mocked LLM)', async () => {
    await aiOrchestrator.invoke(
      {
        messages: [new HumanMessage("Bench query")],
        context: mockContext
      },
      { configurable: { thread_id: mockContext.sessionId } }
    );
  }, { time: 1000 }); // Run for 1 second
});
