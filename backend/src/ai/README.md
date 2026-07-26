# AI Foundation Architecture

This directory contains the Phase 1 foundation, Phase 2 tool-registry design, Phase 3 agent architecture, Phase 4 LangGraph workflow design, Phase 5 RAG architecture, Phase 6 Knowledge Graph AI architecture, Phase 7 Reasoning Engine architecture, Phase 8 Recommendation Engine architecture, Phase 9 Conversation Memory architecture, Phase 10 Prompt Library design, Phase 11 AI Output Contract design, Phase 12 AI Evaluation Framework design, and Phase 13 Voice AI Architecture design for the KSP Intelligence OS AI layer.

These phases are architecture and contracts only.
They intentionally do **not** implement business logic, agent runtime behavior, LLM calls, executable RAG pipelines, graph database integrations, reasoning runtime execution, recommendation runtime execution, memory runtime persistence, evaluation runtime execution, or voice/translation provider integration.

## AI Operating System Positioning

KSP Intelligence OS should not behave like:

```text
User → LLM → Database → Answer
```

It should behave like:

```text
User
  ↓
AI Orchestrator
  ↓
Specialized Agents (future phases)
  ↓
Knowledge Graph + RAG + Analytics + Legal Engine + Recommendation Engine
  ↓
Evidence Aggregator
  ↓
Confidence + Explainability
  ↓
Provider Abstraction
  ↓
Structured Response
```

## Phase 1 Scope

Implemented so far:

- AI folder structure
- AI layers definition
- request lifecycle definitions
- orchestrator interfaces
- provider abstraction interfaces
- shared AI types and result contracts
- prompt management interfaces
- caching interfaces
- audit interfaces
- rate-limit interfaces
- AI logging wrapper
- AI error model
- AI configuration
- dependency map definitions
- AI tool registry interfaces
- per-tool input/output contracts
- tool validation / permission / error / logging contract model
- agent interfaces for investigation, legal, analytics, graph, recommendation, report, and supervisor roles
- LangGraph-style routing contracts and agent registry abstractions
- per-agent responsibility, memory, prompt, confidence, evidence, and failure-handling policies
- workflow node definitions from START to END
- graph state, transitions, retry policies, and execution-pipeline interfaces
- human-review gate, queue, and resolution contracts
- RAG collection definitions for legal, FIR, crime reports, police SOP, acts, IPC, victim statistics, and crime analytics
- chunking, embedding, retriever, vector store, reranker, citation, context-builder, prompt-builder, and cache interfaces
- RAG pipeline dependency and result contracts
- knowledge graph node and edge type contracts aligned to the intelligence graph design
- graph traversal, shortest path, k-hop search, community detection, centrality, relationship expansion, summarization, and explanation interfaces
- knowledge-graph layer capability and orchestration contracts
- reasoning engine pipeline contracts from intent detection through human escalation
- stage-component interfaces for database, graph, legal, and analytics retrieval plus evidence validation, recommendation generation, confidence, explainability, and hallucination detection
- reasoning-state and final response contracts for evidence-backed AI outputs
- recommendation engine capability contracts for investigation leads, legal recommendation, missing evidence, similar cases, repeat offender, gang detection, officer assignment, risk score, and priority
- recommendation result contracts that require evidence, confidence, reason, and review-required flags for every recommendation
- conversation memory contracts for session memory, case memory, officer context, conversation history, temporary memory, working memory, long-term memory, summarization, expiry, and privacy rules
- prompt library definitions for system, investigation, legal, analytics, graph, recommendation, report, supervisor, translation, and voice workflows
- structured prompt contracts covering role, instructions, output format, guardrails, and examples without hardcoded API calls
- a standard AI output contract so every agent returns the same JSON structure for summary, reasoning, evidence, confidence, citations, related entities, recommendations, graph, analytics, legal sections, warnings, follow-up questions, review requirements, and metadata
- an AI evaluation framework covering 8 evaluation dimensions (legal accuracy, retrieval accuracy, evidence quality, hallucination, latency, recommendation accuracy, graph accuracy, conversation quality)
- 30 evaluation metric definitions with target ranges, failure severities, and evaluation methods
- evaluation component interfaces for each dimension, plus reporter, selector, runner, comparator, trend tracker, and governance
- agent-to-dimension mapping profiles for all 7 agent types
- benchmark scenario templates for each evaluation dimension
- batch evaluation suite and run contracts for coordinated benchmark execution
- cross-agent and cross-run comparison contracts with regression detection and trend tracking
- evaluation governance types including review workflows, escalation rules, audit trail entries, and retention policies
- dataset profiles for golden sets, synthetic benchmarks, reviewed cases, and conversation quality suites
- default dimension weights, score label thresholds, comparison thresholds, and governance configuration
- voice AI architecture supporting English and Kannada, with STT/TTS provider interfaces, streaming support, and interruption (barge-in) handling
- noise handling policies mapped to 8 field environments (e.g., police station, traffic, crowd)
- voice pipeline orchestrator contracts integrating STT, translation, memory, reasoning, and TTS
- AI output condensation formatting to convert verbose structured outputs into speech-friendly delivery
- domain-specific STT phrase boosting and translation term preservation rules for legal sections, case IDs, and police terminology

Explicitly not implemented yet:

- concrete agent implementations
- executable RAG retrieval
- vector search runtime integration
- graph database runtime integration
- reasoning runtime execution
- recommendation runtime execution
- memory runtime persistence
- evaluation runtime execution
- voice and translation provider integration
- model invocations
- tool execution
- executable workflow runtime

## Architecture Layers

| Layer                             | Responsibility                                                            |
| --------------------------------- | ------------------------------------------------------------------------- |
| Entry Layer                       | Accept normalized AI requests from backend modules.                       |
| Orchestration Layer               | Manage lifecycle, planning, state, routing, and response assembly.        |
| Domain Execution Layer            | Future home for agents and deterministic reasoning modules.               |
| Retrieval Layer                   | Future home for tools, graph, legal, analytics, and retrieval connectors. |
| Evidence Layer                    | Merge facts, citations, warnings, and provenance.                         |
| Confidence / Explainability Layer | Score reliability and expose why the answer was formed.                   |
| Provider Layer                    | Abstract Ollama/Local provider contracts for on-premise deployments.      |
| Governance Layer                  | Audit, masking, caching, rate limits, and operational safeguards.         |

## AI Lifecycle

```text
Request Accepted
    ↓
Intent / Context Preparation
    ↓
Permission & Jurisdiction Validation
    ↓
Task Planning
    ↓
Execution Routing
    ↓
Evidence Aggregation
    ↓
Confidence & Explainability
    ↓
Provider Response Synthesis
    ↓
Output Contract Formatting
    ↓
Audit & Metrics
```

## Dependency Diagram

```text
HTTP / Backend Module
    ↓
AI Orchestrator Interface
    ↓
Lifecycle State + Planning Contracts
    ↓
Future Agents / Tools / Retrieval Modules
    ↓
Evidence + Confidence + Explainability
    ↓
AI Provider Abstraction
    ↓
Structured AI Output
```

## Folder Layout

```text
ai/
├── config/
├── orchestrator/
├── providers/
├── shared/
├── core/
│   ├── audit/
│   ├── cache/
│   ├── errors/
│   ├── interfaces/
│   ├── logging/
│   ├── prompts/
│   ├── rate-limit/
│   └── utils/
├── core/            (Phase 1, 2, 4 — orchestration, tools, langgraph)
├── agents/          (Phase 3 — registry, routing)
├── rag/             (Phase 5 — retrieval, chunking, ingest)
├── retrieval/       (Phase 6 — knowledge graph, case similarity)
├── reasoning/       (Phase 7 — evidence, synthesis, inference)
├── recommendation/  (Phase 8 — alerts, risks, actions)
├── memory/          (Phase 9 — session, case, working, long-term)
├── prompts/         (Phase 10 — instructions, examples, guardrails)
├── shared/          (Phase 11 — ai-output-contract, ai-request)
├── evaluation/      (Phase 12 — evaluation framework)
├── voice/           (Phase 13 — STT, TTS, streaming, noise)
├── translation/     (Phase 13 — en-IN/kn-IN, legal term preservation)
├── models/          (reserved)
└── tests/           (reserved)
```

## Design Rules

1. The provider layer must stay isolated from business modules.
2. Future agents must depend on interfaces, not concrete providers.
3. Prompt management must be versioned, but prompt content is deferred.
4. Audit, caching, and rate limits must be AI-specific and traceable.
5. Sensitive outputs must be governed before provider synthesis.
6. The final response must follow one structured contract.
