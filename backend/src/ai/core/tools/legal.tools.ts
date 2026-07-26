import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { legalService } from '../../../modules/legal/legal.container';

export const SearchActsTool = new DynamicStructuredTool({
  name: 'search_acts',
  description: 'Search for available legal Acts (e.g. BNS, IPC) in the system registry.',
  schema: z.object({
    searchTerm: z.string().optional().describe('Keyword to search within Act titles.'),
    limit: z.number().default(10),
  }),
  func: async ({ searchTerm, limit }) => {
    try {
      const result = await legalService.listActs({ query: searchTerm, pageSize: limit, page: 1 });
      return JSON.stringify(result.data);
    } catch (error) {
      return `Failed to search acts: ${(error as Error).message}`;
    }
  },
});

export const SearchSectionsTool = new DynamicStructuredTool({
  name: 'search_sections',
  description: 'Search for specific legal sections (e.g. IPC 302, BNS 103).',
  schema: z.object({
    actCode: z.string().describe('The code of the Act (e.g. IPC, BNS).'),
    sectionCode: z.string().optional().describe('The specific section number (e.g. 302).'),
    searchTerm: z.string().optional().describe('Keywords to search inside the section description.'),
    limit: z.number().default(5),
  }),
  func: async ({ actCode, sectionCode, searchTerm, limit }) => {
    try {
      if (sectionCode && !searchTerm) {
        const result = await legalService.getSection(actCode, sectionCode);
        return JSON.stringify([result.data]);
      }
      const result = await legalService.listSections({ actCode, query: searchTerm, pageSize: limit, page: 1 });
      return JSON.stringify(result.data);
    } catch (error) {
      return `Failed to search sections: ${(error as Error).message}`;
    }
  },
});

export const RecommendSectionsTool = new DynamicStructuredTool({
  name: 'recommend_sections',
  description: 'Placeholder tool: Fetch legal sections mapped to a specific Crime Head ID to recommend to the investigator.',
  schema: z.object({
    crimeHeadId: z.string().describe('The Crime Head ID from the case classification.'),
  }),
  func: async ({ crimeHeadId }) => {
    try {
      const result = await legalService.listSectionsByCrimeHead(BigInt(crimeHeadId));
      return JSON.stringify(result.data, (key, value) => typeof value === 'bigint' ? value.toString() : value);
    } catch (error) {
      return `Failed to fetch recommended sections: ${(error as Error).message}`;
    }
  },
});
