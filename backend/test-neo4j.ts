import { Neo4jClient } from './src/ai/graph/neo4j-client';

async function testNeo4j() {
  const client = Neo4jClient.getInstance();
  try {
    await client.verifyConnectivity();
    console.log('✅ Successfully connected to Neo4j!');
  } catch (error) {
    console.error('❌ Failed to connect to Neo4j:', error);
  } finally {
    await client.close();
  }
}

testNeo4j();
