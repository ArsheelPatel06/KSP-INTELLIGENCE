import neo4j, { Driver, Session, SessionMode } from 'neo4j-driver';
import { logger } from '../../core/logger/logger';

export class Neo4jClient {
  private static instance: Neo4jClient;
  private driver: Driver;

  private constructor() {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';

    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 2 * 60 * 1000,
    });
  }

  public static getInstance(): Neo4jClient {
    if (!Neo4jClient.instance) {
      Neo4jClient.instance = new Neo4jClient();
    }
    return Neo4jClient.instance;
  }

  public getSession(mode: SessionMode = neo4j.session.WRITE): Session {
    return this.driver.session({ defaultAccessMode: mode });
  }

  public async close(): Promise<void> {
    await this.driver.close();
    logger.info('Neo4j connection closed.');
  }

  public async verifyConnectivity(): Promise<void> {
    try {
      await this.driver.verifyConnectivity();
      logger.info('Neo4j connectivity verified successfully.');
    } catch (error) {
      logger.error({ error }, 'Failed to verify Neo4j connectivity');
      throw error;
    }
  }
}
