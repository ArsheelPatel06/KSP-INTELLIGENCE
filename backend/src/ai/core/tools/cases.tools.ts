import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { caseService } from '../../../modules/cases/cases.container';

export const SearchCasesTool = new DynamicStructuredTool({
  name: 'search_cases',
  description: 'Search for existing police cases/FIRs based on criteria like district, status, or crime type. Returns a list of cases.',
  schema: z.object({
    districtId: z.number().optional().describe('The ID of the district.'),
    limit: z.number().default(10).describe('Max number of cases to return.'),
  }),
  func: async ({ districtId, limit }) => {
    try {
      const result = await caseService.listCases({
        districtId: districtId ? BigInt(districtId) : undefined,
        pageSize: limit,
        page: 1,
      });
      return JSON.stringify(result.data);
    } catch (error) {
      return `Failed to search cases: ${(error as Error).message}`;
    }
  },
});

export const GetCaseByIdTool = new DynamicStructuredTool({
  name: 'get_case_by_id',
  description: 'Retrieve detailed facts and information about a specific case using its caseMasterId or crimeNo.',
  schema: z.object({
    caseMasterId: z.string().optional().describe('The primary ID of the case as a string.'),
    crimeNo: z.string().optional().describe('The crime number of the case.'),
  }),
  func: async ({ caseMasterId, crimeNo }) => {
    try {
      if (caseMasterId) {
        const result = await caseService.getCaseById(BigInt(caseMasterId));
        return JSON.stringify(result.data, (key, value) => typeof value === 'bigint' ? value.toString() : value);
      } else if (crimeNo) {
        const result = await caseService.getCaseByCrimeNo(crimeNo);
        return JSON.stringify(result.data, (key, value) => typeof value === 'bigint' ? value.toString() : value);
      }
      return 'You must provide either a caseMasterId or crimeNo.';
    } catch (error) {
      return `Failed to retrieve case: ${(error as Error).message}`;
    }
  },
});

export const GetSimilarCasesTool = new DynamicStructuredTool({
  name: 'get_similar_cases',
  description: 'Find historical cases that share similar Modus Operandi (MO) or facts to a given case.',
  schema: z.object({
    caseMasterId: z.string().describe('The ID of the case to find similarities for.'),
    limit: z.number().default(5),
  }),
  func: async ({ caseMasterId, limit }) => {
    try {
      const result = await caseService.getSimilarCases(BigInt(caseMasterId), limit);
      return JSON.stringify(result.data, (key, value) => typeof value === 'bigint' ? value.toString() : value);
    } catch (error) {
      return `Failed to find similar cases: ${(error as Error).message}`;
    }
  },
});

export const GenerateTimelineTool = new DynamicStructuredTool({
  name: 'generate_timeline',
  description: 'Fetch chronologically ordered events, victims, and case facts for a specific case so you can summarize the timeline. DO NOT use this for generic searches.',
  schema: z.object({
    caseMasterId: z.string().describe('The ID of the case.'),
  }),
  func: async ({ caseMasterId }) => {
    try {
      // In a real scenario, this might call a dedicated timeline service.
      // For now, fetch the case and extract temporal facts.
      const result = await caseService.getCaseById(BigInt(caseMasterId));
      
      const timelineData = {
        incidentFromDate: result.data.incidentFromDate,
        incidentToDate: result.data.incidentToDate,
        status: result.data.status,
        briefFacts: result.data.briefFacts,
      };
      
      return JSON.stringify(timelineData);
    } catch (error) {
      return `Failed to generate timeline data: ${(error as Error).message}`;
    }
  },
});
