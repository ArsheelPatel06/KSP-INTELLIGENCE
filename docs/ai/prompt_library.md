# Prompt Library

Purpose: define the AI prompt system for KSP Intelligence OS.

Prompts should be managed as reusable assets, not hardcoded inline strings.

## Prompt Files

```text
prompts/
    investigation.md
    legal.md
    analytics.md
    graph.md
    recommendation.md
    summarization.md
    translation.md
    routing.md
    supervisor.md
    safety.md
```

## Prompt Design Principles

- prompts should encode role, not personality fluff
- prompts must enforce evidence-first behavior
- prompts must forbid invented facts
- prompts must require structured output
- prompts must make review requirements explicit

---

## 1. Routing Prompt

### Purpose
Route the query to the correct agent set.

### Requirements
Must determine:
- primary intent
- secondary intent
- required agents
- required tools
- whether clarification is needed

### Guardrails
- do not answer user directly
- output only routing decision

---

## 2. Investigation Prompt

### Purpose
Guide the Investigation Agent.

### Requirements
- summarize case facts
- identify timeline signals
- identify missing facts
- identify similar case leads
- separate evidence from inference

### Guardrails
- do not recommend law beyond evidence-backed observations
- do not declare guilt

---

## 3. Legal Prompt

### Purpose
Guide the Legal Agent.

### Requirements
- use only retrieved legal evidence
- recommend sections only when evidence supports them
- explain why
- show missing facts
- mark review required when ambiguity exists

### Guardrails
- never invent legal sections
- never hide uncertainty

---

## 4. Analytics Prompt

### Purpose
Guide the Analytics Agent.

### Requirements
- explain trends from retrieved statistics
- surface anomalies and warnings
- keep outputs analytical, not speculative

### Guardrails
- do not overclaim causation
- distinguish trend from forecast

---

## 5. Graph Prompt

### Purpose
Guide the Graph Agent.

### Requirements
- interpret relationships clearly
- label inferred vs confirmed links
- describe shortest path meaning
- highlight confidence of edges

### Guardrails
- do not present inferred link as fact
- do not imply criminal conspiracy from weak connection alone

---

## 6. Recommendation Prompt

### Purpose
Guide the Recommendation Agent.

### Requirements
- suggest next best actions
- prioritize leads
- identify missing evidence
- explain urgency and rationale

### Guardrails
- recommendations are advisory only
- show uncertainty and review need

---

## 7. Summarization / Report Prompt

### Purpose
Generate case briefs and supervisor summaries.

### Requirements
- concise operational summary
- evidence-backed bullets
- actions and blockers
- neutral tone

### Guardrails
- no invented evidence
- no omitted uncertainty

---

## 8. Translation Prompt

### Purpose
Translate questions and responses between English and Kannada while preserving legal meaning.

### Requirements
- preserve section numbers and legal terminology
- keep identifiers unchanged
- preserve caution and confidence language

### Guardrails
- do not paraphrase legal references incorrectly

---

## 9. Supervisor Prompt

### Purpose
Guide the Supervisor Agent.

### Requirements
- rank urgent operational items
- summarize delays and workload
- highlight spikes and high-risk items
- recommend review actions

### Guardrails
- stay within jurisdiction
- prefer reviewed signals where possible

---

## 10. Safety Prompt

### Purpose
Act as a final guardrail prompt or validation step.

### Requirements
- verify output has evidence
- verify confidence reason exists
- verify no guilt claims
- verify no unauthorized sensitive details
- verify review-required fields are present where needed

## Suggested Improvement

Create prompt templates with variables for:

- role
- jurisdiction
- active case
- desired output format
- evidence bundle summary
- confidence expectations

This will keep prompts consistent across agents while still contextualized.
