import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { graphService } from '../../../modules/graph/graph.container';

export const SearchGraphNodesTool = new DynamicStructuredTool({
  name: 'search_graph_nodes',
  description: 'Search for entities (nodes) in the Knowledge Graph. Use this to find people, vehicles, phones, locations, or cases by name, ID, or label.',
  schema: z.object({
    query: z.string().optional().describe('Text to search across node properties.'),
    nodeLabel: z.string().optional().describe('Optional label to filter (e.g. "Person", "Vehicle", "Phone", "Location").'),
    sourceTable: z.string().optional().describe('Optional underlying source table (e.g. "suspect", "victim", "case_master").'),
  }),
  func: async ({ query, nodeLabel, sourceTable }) => {
    try {
      const result = await graphService.searchNodes({
        query,
        nodeLabel,
        sourceTable,
        page: 1,
        pageSize: 10,
      });
      // Convert BigInts to Strings for JSON serialization
      return JSON.stringify(result.data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
    } catch (error) {
      return `Failed to search graph nodes: ${(error as Error).message}`;
    }
  },
});

export const ExpandGraphNodeTool = new DynamicStructuredTool({
  name: 'expand_graph_node',
  description: 'Expands a specific Knowledge Graph node to discover its hidden relationships, connections, and networks (e.g. find all connections for a suspect or a phone number).',
  schema: z.object({
    nodeId: z.string().describe('The ID of the node to expand (retrieved from search_graph_nodes or other tools).'),
    direction: z.enum(['incoming', 'outgoing', 'both']).optional().describe('Direction of the relationships to traverse.'),
    relationshipType: z.string().optional().describe('Specific relationship to look for (e.g. "OWNS", "CALLS", "PARTICIPATES_IN").'),
  }),
  func: async ({ nodeId, direction, relationshipType }) => {
    try {
      const result = await graphService.expandNode(BigInt(nodeId), {
        direction,
        relationshipType,
      });
      return JSON.stringify(result.data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
    } catch (error) {
      return `Failed to expand node: ${(error as Error).message}`;
    }
  },
});

export const GetCaseGraphTool = new DynamicStructuredTool({
  name: 'get_case_graph',
  description: 'Retrieves the complete graph network centered around a specific case. Use to see all entities linked to a crime.',
  schema: z.object({
    caseMasterId: z.string().describe('The ID of the case (caseMasterId).'),
    includeInferred: z.boolean().optional().describe('Whether to include inferred/AI-predicted links.'),
  }),
  func: async ({ caseMasterId, includeInferred }) => {
    try {
      const result = await graphService.getCaseGraph(BigInt(caseMasterId), {
        includeInferred,
      });
      return JSON.stringify(result.data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
    } catch (error) {
      return `Failed to get case graph: ${(error as Error).message}`;
    }
  },
});
