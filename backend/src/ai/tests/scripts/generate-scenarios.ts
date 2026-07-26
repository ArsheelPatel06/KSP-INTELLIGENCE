import fs from 'fs';
import path from 'path';

export interface TestScenario {
  id: string;
  category: 'INVESTIGATION' | 'LEGAL' | 'ANALYTICS' | 'GRAPH';
  query: string;
  expectedIntent: string;
  expectedAgents: string[];
}

const investigationTemplates = [
  "What is the next logical step in case #{id} considering the suspect fled?",
  "Review FIR #{id} and suggest missing evidence.",
  "What similar modus operandi cases exist for burglary in District {district}?",
  "Analyze the witness statements for case #{id} and find contradictions."
];

const legalTemplates = [
  "What IPC sections apply if a suspect uses a fake identity online?",
  "Are there missing charges in case #{id} for assault on a public servant?",
  "What is the maximum penalty under BNS for extortion?",
  "Can you validate if section 302 IPC is applicable given the autopsy report?"
];

const analyticsTemplates = [
  "Show me the crime trends for cyber fraud in {district} over the last 6 months.",
  "Which district has the highest rate of vehicle theft this year?",
  "Are there seasonal patterns in domestic violence cases?",
  "Compare the resolution rate between District A and District B."
];

const graphTemplates = [
  "Find the shortest path between suspect {suspect} and victim {victim}.",
  "What are the connections of phone number {phone}?",
  "Show the network of repeat offenders in gang {gang}.",
  "Discover hidden links between Officer {officer} and the recently closed case #{id}."
];

function generateScenarios(count: number, category: TestScenario['category'], templates: string[], expectedIntent: string, expectedAgents: string[]): TestScenario[] {
  const scenarios: TestScenario[] = [];
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    const query = template
      .replace('{id}', Math.floor(Math.random() * 10000).toString())
      .replace('{district}', 'Bengaluru')
      .replace('{suspect}', 'John Doe')
      .replace('{victim}', 'Jane Smith')
      .replace('{phone}', '+919999999999')
      .replace('{gang}', 'Local Syndicate')
      .replace('{officer}', 'Insp. Patil');
      
    scenarios.push({
      id: `${category.toLowerCase()}_${i + 1}`,
      category,
      query,
      expectedIntent,
      expectedAgents
    });
  }
  return scenarios;
}

async function main() {
  console.log('Generating 300 test scenarios...');
  
  const scenarios: TestScenario[] = [
    ...generateScenarios(100, 'INVESTIGATION', investigationTemplates, 'investigation', ['investigation']),
    ...generateScenarios(100, 'LEGAL', legalTemplates, 'legal_analysis', ['legal']),
    ...generateScenarios(50, 'ANALYTICS', analyticsTemplates, 'analytics', ['analytics']),
    ...generateScenarios(50, 'GRAPH', graphTemplates, 'graph_traversal', ['graph'])
  ];

  const outputPath = path.join(__dirname, '../datasets/scenarios.json');
  
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(scenarios, null, 2));
  console.log(`Successfully generated ${scenarios.length} scenarios at ${outputPath}`);
}

main().catch(console.error);
