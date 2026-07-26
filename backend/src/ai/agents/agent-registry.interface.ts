import type { AiAgent, AiAgentName } from './agent.types';
import type {
  AnalyticsAgent,
  GraphAgent,
  InvestigationAgent,
  LegalAgent,
  RecommendationAgent,
  ReportAgent,
  SupervisorAgent,
} from './domain-agents.interface';

export interface AiAgentRegistry {
  getAgent<TInput, TOutput>(name: AiAgentName): AiAgent<TInput, TOutput> | undefined;

  readonly investigation: InvestigationAgent;
  readonly legal: LegalAgent;
  readonly analytics: AnalyticsAgent;
  readonly graph: GraphAgent;
  readonly recommendation: RecommendationAgent;
  readonly report: ReportAgent;
  readonly supervisor: SupervisorAgent;
}
