# AI Modules

Purpose: define the major AI capability modules inside the AI Operating System.

This document now sits below the orchestrator/agent architecture.
The platform should not rely on one generic chatbot.
It should rely on specialized modules coordinated by the orchestrator and agent team.

Reference documents:

- `docs/ai/ai_architecture.md`
- `docs/ai/agent_specifications.md`
- `docs/ai/tool_registry.md`
- `docs/ai/langgraph_workflow.md`
- `docs/ai/rag_architecture.md`
- `docs/ai/ai_reasoning_engine.md`
- `docs/database/master_schema.md`

## AI Operating System Principle

```text
User / Officer Query
        ↓
AI Orchestrator
        ↓
Specialized Agents
        ↓
AI Modules + Tools + RAG + Graph + Analytics
        ↓
Evidence + Confidence + Recommendation
        ↓
Human Review / Action
```

## Core Module Families

| Family             | Modules                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Investigation      | Case Summarization, Case Similarity, FIR Validation, Evidence Gap Detection, Chargesheet Readiness |
| Legal              | Legal Recommendation, Legal Retrieval, Punishment Lookup                                           |
| Intelligence Graph | Network Analysis, Gang Detection, Relationship Expansion                                           |
| Analytics          | Crime Prediction, Hotspot Detection, Victim Risk Analysis, District Comparison                     |
| Advisory           | Recommendation Engine, Repeat Offender Detection, Supervisor Attention                             |
| Interaction        | Conversation, Voice Assistant, Translation                                                         |
| Documentation      | Report Generation                                                                                  |
| Governance         | Document RAG Retrieval, AI Governance and Audit                                                    |

## Key Modules

### Investigation-Focused

- Case Similarity
- Case Summarization
- FIR Validation
- Evidence Gap Detection
- Chargesheet Readiness

### Legal-Focused

- Legal Recommendation
- Legal section retrieval
- punishment explanation

### Analytics-Focused

- Crime Prediction
- Hotspot Detection
- Victim Risk Analysis
- district / unit comparison

### Graph-Focused

- Network Analysis
- Gang Detection
- hidden-link exploration

### Advisory-Focused

- Recommendation Engine
- Repeat Offender Detection
- Supervisor Attention

### Interaction-Focused

- Conversation
- Voice Assistant
- Translation

### Governance-Focused

- Document RAG Retrieval
- AI Governance and Audit

## Build Order Recommendation

| Phase   | Priority Modules                                                               |
| ------- | ------------------------------------------------------------------------------ |
| Phase 1 | Document RAG Retrieval, Case Summarization, Legal Recommendation, Conversation |
| Phase 2 | Case Similarity, FIR Validation, Evidence Gap Detection, Risk Score            |
| Phase 3 | Hotspot Detection, Crime Prediction, Report Generation                         |
| Phase 4 | Network Analysis, Repeat Offender Detection, Financial Fraud / Money Trail     |
| Phase 5 | Gang Detection, Voice Assistant, advanced governance dashboards                |

## Module Design Rule

Every module should define:

- input
- output
- model / logic type
- algorithm
- training / source data
- evaluation
- future improvements

## Important Architectural Rule

Modules are not called directly by the UI.
They are called by agents through the orchestrator.

## Suggested Improvement

Later, split modules into:

- deterministic modules
- ML modules
- LLM synthesis modules

That separation will make performance, explainability, and debugging much easier.
