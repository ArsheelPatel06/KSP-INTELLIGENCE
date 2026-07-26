import { Neo4jClient } from './neo4j-client';
import neo4j from 'neo4j-driver';

export interface EntityInput {
  label: string;
  id: string;
  properties: Record<string, any>;
}

export interface RelationshipInput {
  sourceId: string;
  targetId: string;
  type: string;
  properties?: Record<string, any>;
}

export class GraphService {
  private client = Neo4jClient.getInstance();

  /**
   * Upsert a node in the graph
   */
  public async upsertEntity(entity: EntityInput): Promise<void> {
    const session = this.client.getSession(neo4j.session.WRITE);
    try {
      const query = `
        MERGE (n:${entity.label} {id: $id})
        SET n += $properties
      `;
      await session.run(query, {
        id: entity.id,
        properties: entity.properties,
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Link two entities with a relationship
   */
  public async linkEntities(rel: RelationshipInput): Promise<void> {
    const session = this.client.getSession(neo4j.session.WRITE);
    try {
      const query = `
        MATCH (a {id: $sourceId})
        MATCH (b {id: $targetId})
        MERGE (a)-[r:${rel.type}]->(b)
        SET r += $properties
      `;
      await session.run(query, {
        sourceId: rel.sourceId,
        targetId: rel.targetId,
        properties: rel.properties || {},
      });
    } finally {
      await session.close();
    }
  }

  /**
   * N-hop traversal from a specific entity
   */
  public async traverse(entityId: string, maxHops: number = 2): Promise<any> {
    const session = this.client.getSession(neo4j.session.READ);
    try {
      const query = `
        MATCH path = (start {id: $entityId})-[*1..${maxHops}]-(end)
        RETURN path LIMIT 50
      `;
      const result = await session.run(query, { entityId });
      return result.records.map(record => record.get('path'));
    } finally {
      await session.close();
    }
  }

  /**
   * Find shortest path between two entities
   */
  public async shortestPath(startId: string, endId: string): Promise<any> {
    const session = this.client.getSession(neo4j.session.READ);
    try {
      const query = `
        MATCH path = shortestPath((start {id: $startId})-[*..10]-(end {id: $endId}))
        RETURN path
      `;
      const result = await session.run(query, { startId, endId });
      if (result.records.length === 0) return null;
      return result.records[0].get('path');
    } finally {
      await session.close();
    }
  }

  /**
   * Find highly connected communities (Basic Louvain approximation via standard queries)
   */
  public async detectCommunities(label: string): Promise<any> {
    const session = this.client.getSession(neo4j.session.READ);
    try {
      // Note: In production with Graph Data Science (GDS) plugin, use gds.louvain
      // Without GDS, we find dense subgraphs using degree centrality heuristically
      const query = `
        MATCH (n:${label})-[r]-(m:${label})
        WITH n, count(r) as degree, collect(m.id) as connections
        WHERE degree > 2
        RETURN n.id as entityId, degree, connections
        ORDER BY degree DESC LIMIT 10
      `;
      const result = await session.run(query);
      return result.records.map(record => ({
        entityId: record.get('entityId'),
        degree: record.get('degree'),
        connections: record.get('connections'),
      }));
    } finally {
      await session.close();
    }
  }

  /**
   * Identify central nodes (hubs/influencers/repeat offenders)
   */
  public async calculateCentrality(label: string): Promise<any> {
    const session = this.client.getSession(neo4j.session.READ);
    try {
      // Basic Degree Centrality
      const query = `
        MATCH (n:${label})-[r]-()
        RETURN n.id as entityId, count(r) as score
        ORDER BY score DESC LIMIT 10
      `;
      const result = await session.run(query);
      return result.records.map(record => ({
        entityId: record.get('entityId'),
        score: record.get('score'),
      }));
    } finally {
      await session.close();
    }
  }
}
