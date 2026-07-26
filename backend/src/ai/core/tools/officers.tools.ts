import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { officerService } from '../../../modules/officers/officers.container';

export const SearchOfficersTool = new DynamicStructuredTool({
  name: 'search_officers',
  description: 'Search for police officers by rank, district, or unit. Use this to find assignment candidates.',
  schema: z.object({
    districtId: z.number().optional(),
    unitId: z.number().optional(),
    limit: z.number().default(10),
  }),
  func: async ({ districtId, unitId, limit }) => {
    try {
      const result = await officerService.listOfficers({ 
        districtId: districtId ? BigInt(districtId) : undefined,
        unitId: unitId ? BigInt(unitId) : undefined,
        pageSize: limit, 
        page: 1 
      });
      return JSON.stringify(result.data, (key, value) => typeof value === 'bigint' ? value.toString() : value);
    } catch (error) {
      return `Failed to search officers: ${(error as Error).message}`;
    }
  },
});

export const GetAssignedCasesTool = new DynamicStructuredTool({
  name: 'get_assigned_cases',
  description: 'Retrieve the list of open cases currently assigned to a specific officer.',
  schema: z.object({
    employeeId: z.string().describe('The primary employee ID of the officer.'),
  }),
  func: async ({ employeeId }) => {
    try {
      const result = await officerService.getAssignedCases(BigInt(employeeId), { page: 1, pageSize: 20 });
      return JSON.stringify(result.data, (key, value) => typeof value === 'bigint' ? value.toString() : value);
    } catch (error) {
      return `Failed to fetch assigned cases: ${(error as Error).message}`;
    }
  },
});
