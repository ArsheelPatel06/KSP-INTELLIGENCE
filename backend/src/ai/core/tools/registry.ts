import { SearchCasesTool, GetCaseByIdTool, GetSimilarCasesTool, GenerateTimelineTool } from './cases.tools';
import { SearchVictimsTool } from './victims.tools';
import { SearchOfficersTool, GetAssignedCasesTool } from './officers.tools';
import { SearchActsTool, SearchSectionsTool, RecommendSectionsTool } from './legal.tools';
import { SearchCrimePatternsTool, GenerateSummaryTool } from './analytics.tools';
import { SearchGraphNodesTool, ExpandGraphNodeTool, GetCaseGraphTool } from './graph.tools';
import { GetCaseRecommendationsTool, SearchRecommendationsTool, GetHighPriorityRiskScoresTool } from './recommendation.tools';

/**
 * The Tool Registry groups raw backend service wrappers into domain-specific toolkits
 * that can be bound to the Ollama LLM provider during node execution.
 * 
 * By using these tools, the AI layer NEVER executes raw SQL. It strictly adheres
 * to the backend's existing Service layer validations and Row-Level Security.
 */

export const investigationTools = [
  SearchCasesTool,
  GetCaseByIdTool,
  GetSimilarCasesTool,
  GenerateTimelineTool,
  SearchVictimsTool,
  SearchOfficersTool,
  GetAssignedCasesTool,
];

export const legalTools = [
  SearchActsTool,
  SearchSectionsTool,
  RecommendSectionsTool,
];

export const analyticsTools = [
  SearchCrimePatternsTool,
  GenerateSummaryTool,
];

export const graphTools = [
  SearchGraphNodesTool,
  ExpandGraphNodeTool,
  GetCaseGraphTool,
];

export const recommendationTools = [
  GetCaseRecommendationsTool,
  SearchRecommendationsTool,
  GetHighPriorityRiskScoresTool,
];

// Optionally, export a master list if a supervisor agent needs to see all capabilities
export const allTools = [
  ...investigationTools,
  ...legalTools,
  ...analyticsTools,
  ...graphTools,
  ...recommendationTools,
];
