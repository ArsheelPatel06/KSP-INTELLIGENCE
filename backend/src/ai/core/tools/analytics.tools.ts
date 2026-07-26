import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { analyticsService } from '../../../modules/analytics/analytics.container';

export const SearchCrimePatternsTool = new DynamicStructuredTool({
  name: 'search_crime_patterns',
  description: 'Search for statistical crime patterns, aggregates, and trends across districts and time periods.',
  schema: z.object({
    districtId: z.number().optional(),
    year: z.number().optional(),
    month: z.number().optional(),
  }),
  func: async ({ districtId, year, month }) => {
    try {
      // Fetch aggregate data directly for the LLM
      const result = await analyticsService.getCrimeStatisticAggregate({
        districtId: districtId ? BigInt(districtId) : undefined,
        reportYear: year,
        reportMonth: month,
      });
      return JSON.stringify(result.data);
    } catch (error) {
      return `Failed to fetch crime patterns: ${(error as Error).message}`;
    }
  },
});

export const GenerateSummaryTool = new DynamicStructuredTool({
  name: 'generate_summary',
  description: 'Placeholder tool: Instructs the system to aggregate multiple data points into a summary report. (Use SearchCrimePatternsTool for raw data).',
  schema: z.object({
    topic: z.string().describe('The topic to summarize.'),
  }),
  func: async ({ topic }) => {
    return `Summary generation requested for topic: ${topic}. The LLM should synthesize this from retrieved context instead of relying entirely on this stub tool.`;
  },
});
