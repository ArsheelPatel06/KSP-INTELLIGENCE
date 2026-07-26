import { describe, it, expect, beforeAll } from 'vitest';
import { aiOrchestrator } from '../core/workflow/orchestrator';
import { HumanMessage } from '@langchain/core/messages';
import fs from 'fs';
import path from 'path';
import type { TestScenario } from './scripts/generate-scenarios';

// Only run these tests if the E2E flag is explicitly passed
const isE2E = process.env.E2E_EVAL === 'true';

const describeE2E = isE2E ? describe : describe.skip;

describeE2E('E2E Real LLM Evaluation Suite', () => {
  let scenarios: TestScenario[] = [];

  beforeAll(() => {
    const datasetPath = path.join(__dirname, 'datasets/scenarios.json');
    if (fs.existsSync(datasetPath)) {
      scenarios = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
    } else {
      console.warn('Scenarios dataset not found. Please run the generation script.');
    }
  });

  const mockContext = {
    requestId: 'e2e-req',
    sessionId: 'e2e-session',
    user: { userId: 'u1', role: 'SUPERVISOR' }, // Use supervisor to avoid tool permission blocks in tests
    channel: 'api' as const
  };

  it('should correctly classify a sample of Investigation intents', async () => {
    const invScenarios = scenarios.filter(s => s.category === 'INVESTIGATION').slice(0, 3);
    
    for (const scenario of invScenarios) {
      const result = await aiOrchestrator.invoke(
        {
          messages: [new HumanMessage(scenario.query)],
          context: mockContext
        },
        { configurable: { thread_id: mockContext.sessionId } }
      );

      // Verify that the supervisor routed this to the Investigation agent
      expect(result.taskPlan.agentsToRun).toContain(scenario.expectedAgents[0]);
    }
  }, 60000); // 60s timeout for LLM inference

  it('should correctly classify a sample of Analytics intents', async () => {
    const anScenarios = scenarios.filter(s => s.category === 'ANALYTICS').slice(0, 3);
    
    for (const scenario of anScenarios) {
      const result = await aiOrchestrator.invoke(
        {
          messages: [new HumanMessage(scenario.query)],
          context: mockContext
        },
        { configurable: { thread_id: mockContext.sessionId } }
      );

      expect(result.taskPlan.agentsToRun).toContain(scenario.expectedAgents[0]);
    }
  }, 60000);
});
