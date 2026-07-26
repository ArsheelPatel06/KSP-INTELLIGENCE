import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { victimService } from '../../../modules/victims/victims.container';

export const SearchVictimsTool = new DynamicStructuredTool({
  name: 'search_victims',
  description: 'Search for victims associated with crimes based on criteria like district, age group, or case linkage.',
  schema: z.object({
    districtId: z.number().optional(),
    caseMasterId: z.string().optional().describe('Filter victims linked to this specific case.'),
    limit: z.number().default(10),
  }),
  func: async ({ districtId, caseMasterId, limit }) => {
    try {
      if (caseMasterId) {
        const result = await victimService.listVictimsByCase(BigInt(caseMasterId), { 
          districtId: districtId ? BigInt(districtId) : undefined, 
          pageSize: limit, 
          page: 1 
        });
        return JSON.stringify(result.data, (key, value) => typeof value === 'bigint' ? value.toString() : value);
      }
      const result = await victimService.listVictims({ 
        districtId: districtId ? BigInt(districtId) : undefined, 
        pageSize: limit, 
        page: 1 
      });
      return JSON.stringify(result.data, (key, value) => typeof value === 'bigint' ? value.toString() : value);
    } catch (error) {
      return `Failed to search victims: ${(error as Error).message}`;
    }
  },
});
