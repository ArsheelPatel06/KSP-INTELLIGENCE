import { StateGraph, MemorySaver, START, END } from '@langchain/langgraph';
import { AiGraphState } from './state';
import { securityShieldNode } from './nodes/security-shield.node';
import { intentDetectionNode } from './nodes/intent-detection.node';
import { entityExtractionNode } from './nodes/entity-extraction.node';
import { supervisorNode } from './nodes/supervisor.node';
import { 
  investigationAgentNode, 
  legalAgentNode, 
  graphAgentNode, 
  analyticsAgentNode, 
  recommendationAgentNode 
} from './nodes/agent-execution.node';
import { evidenceAggregatorNode } from './nodes/evidence-aggregator.node';
import { conflictResolutionNode } from './nodes/conflict-resolution.node';
import { confidenceScoringNode } from './nodes/confidence-scoring.node';
import { generatorNode } from './nodes/generator.node';
import { reportAgentNode } from './nodes/report.node';

/**
 * Conditional routing function after Intent/Entity extraction to Supervisor.
 * If clearance is inherently denied before planning, it goes straight to generator.
 */
/**
 * Conditional routing function after Security Shield
 * If clearance is denied (injection blocked), go straight to generator.
 */
function routeAfterSecurity(state: typeof AiGraphState.State): string {
  if (!state.permissions || !state.permissions.clearanceGranted) {
    return 'generator';
  }
  return 'intent';
}

/**
 * Conditional routing function after Intent/Entity extraction to Supervisor.
 * If clearance is inherently denied before planning, it goes straight to generator.
 */
function routeToSupervisor(state: typeof AiGraphState.State): string {
  return 'supervisor';
}

/**
 * Conditional routing function that reads the taskPlan from the Supervisor
 * and returns the names of the agent nodes to execute in parallel.
 */
function routeToAgents(state: typeof AiGraphState.State): string[] {
  if (!state.permissions.clearanceGranted) {
    return ['generator']; // Send denial to generator
  }

  if (!state.taskPlan || !state.taskPlan.agentsToRun || state.taskPlan.agentsToRun.length === 0) {
    // Default fallback
    return ['investigation'];
  }
  return state.taskPlan.agentsToRun;
}

/**
 * Conditional routing function after Confidence to determine output format.
 */
function routeAfterConfidence(state: typeof AiGraphState.State): string {
  if (state.context?.channel === 'report' || state.detectedIntent === 'reporting' || state.taskPlan?.primaryIntent === 'reporting') {
    return 'report';
  }
  return 'generator';
}

// 1. Initialize the StateGraph with our strictly typed schema
const builder = new StateGraph(AiGraphState)
  // 2. Add all workflow nodes
  .addNode('security', securityShieldNode)
  .addNode('intent', intentDetectionNode)
  .addNode('entities', entityExtractionNode)
  .addNode('supervisor', supervisorNode)
  .addNode('investigation', investigationAgentNode)
  .addNode('legal', legalAgentNode)
  .addNode('graph', graphAgentNode)
  .addNode('analytics', analyticsAgentNode)
  .addNode('recommendation', recommendationAgentNode)
  .addNode('aggregator', evidenceAggregatorNode)
  .addNode('conflicts', conflictResolutionNode)
  .addNode('confidence', confidenceScoringNode)
  .addNode('generator', generatorNode)
  .addNode('report', reportAgentNode)
  
  // 3. Define the edges
  .addEdge(START, 'security')
  
  .addConditionalEdges('security', routeAfterSecurity, {
    intent: 'intent',
    generator: 'generator'
  })
  
  .addEdge('intent', 'entities')
  .addEdge('entities', 'supervisor')
  
  // Supervisor -> [Parallel Agents] OR -> Generator (if denied)
  .addConditionalEdges(
    'supervisor',
    routeToAgents,
    {
      investigation: 'investigation',
      legal: 'legal',
      graph: 'graph',
      analytics: 'analytics',
      recommendation: 'recommendation',
      generator: 'generator' // Denied path
    }
  )

  // [Parallel Agents] -> Aggregator
  .addEdge('investigation', 'aggregator')
  .addEdge('legal', 'aggregator')
  .addEdge('graph', 'aggregator')
  .addEdge('analytics', 'aggregator')
  .addEdge('recommendation', 'aggregator')

  // Aggregator -> Conflicts -> Confidence
  .addEdge('aggregator', 'conflicts')
  .addEdge('conflicts', 'confidence')

  // Confidence -> [Generator OR Report]
  .addConditionalEdges(
    'confidence',
    routeAfterConfidence,
    {
      generator: 'generator',
      report: 'report',
    }
  )
  
  // Terminal nodes -> End
  .addEdge('generator', END)
  .addEdge('report', END);

// 4. Compile the graph with a MemorySaver for checkpoint persistence
const memorySaver = new MemorySaver();

export const aiOrchestrator = builder.compile({
  checkpointer: memorySaver,
});
