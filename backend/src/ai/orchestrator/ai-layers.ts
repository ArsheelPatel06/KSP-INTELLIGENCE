export type AiLayerName =
  | 'entry'
  | 'orchestration'
  | 'domain_execution'
  | 'retrieval'
  | 'evidence'
  | 'confidence'
  | 'provider'
  | 'governance';

export interface AiLayerDefinition {
  name: AiLayerName;
  responsibility: string;
  dependsOn: AiLayerName[];
}

/**
 * Canonical AI layer order for the architecture.
 *
 * Future implementations should respect these responsibilities so the AI system
 * remains debuggable, auditable, and adaptable to different providers.
 */
export const AI_LAYER_DEFINITIONS: readonly AiLayerDefinition[] = [
  {
    name: 'entry',
    responsibility: 'Normalizes backend requests into AI-native request objects.',
    dependsOn: [],
  },
  {
    name: 'orchestration',
    responsibility: 'Owns lifecycle, planning, routing, and response assembly.',
    dependsOn: ['entry'],
  },
  {
    name: 'domain_execution',
    responsibility: 'Future home for agents and deterministic reasoning modules.',
    dependsOn: ['orchestration'],
  },
  {
    name: 'retrieval',
    responsibility: 'Future home for tools, graph access, legal search, analytics, and RAG connectors.',
    dependsOn: ['domain_execution'],
  },
  {
    name: 'evidence',
    responsibility: 'Merges facts, citations, warnings, and provenance into one bundle.',
    dependsOn: ['retrieval'],
  },
  {
    name: 'confidence',
    responsibility: 'Scores certainty and explainability before response synthesis.',
    dependsOn: ['evidence'],
  },
  {
    name: 'provider',
    responsibility: 'Abstracts LLM or model providers behind stable contracts.',
    dependsOn: ['confidence'],
  },
  {
    name: 'governance',
    responsibility: 'Applies audit, caching, rate-limits, masking, and operational safeguards.',
    dependsOn: ['entry', 'orchestration', 'provider'],
  },
] as const;
