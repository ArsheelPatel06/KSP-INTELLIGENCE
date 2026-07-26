# Agent Specifications

Purpose: define every AI agent in KSP Intelligence OS, including responsibilities, tools, inputs, outputs, and limitations.

## Agent Design Principles

- Each agent has a narrow responsibility.
- Agents do not bypass tools.
- Agents should return structured outputs, not prose blobs.
- Agents may collaborate, but the orchestrator remains the final coordinator.
- Agents must distinguish facts from inferences.

---

## 1. Investigation Agent

### Purpose

Behave like an investigating officer focused on one case or a cluster of related cases.

### Responsibilities

- Case summary
- Timeline generation
- Similar case discovery
- Investigation lead generation
- Repeat offender context
- Investigation recommendation support

### Primary Inputs

- case ID / FIR number
- current screen context
- user query
- case narrative
- case timeline artifacts

### Tools

- `searchCases`
- `getCaseDetail`
- `getCaseTimeline`
- `findSimilarCases`
- `searchVictims`
- `searchAccused`
- `searchEvidence`
- `searchRecommendations`

### Output

- summary
- evidence list
- timeline highlights
- similar case references
- suggested leads
- confidence

### Limitations

- does not recommend legal sections as final authority
- does not assert guilt
- must escalate legal interpretation to Legal Agent when needed

---

## 2. Legal Agent

### Purpose

Behave like a police legal support officer.

### Responsibilities

- act lookup
- IPC/BNS/BNSS section lookup
- punishment lookup
- legal explanation
- section recommendation support
- missing-fact identification for legal review

### Source of Truth

All legal outputs must come from:

- `ipc_sections.csv`
- laws / acts datasets
- normalized legal tables
- legal RAG collections

### Tools

- `searchActs`
- `searchIPCSections`
- `getSectionDetail`
- `searchLegalDocuments`
- `findCrimeHeadSectionMappings`
- `recommendSectionsFromNarrative`

### Output

- suggested sections
- legal reasons
- supporting facts
- missing facts
- punishment summary
- confidence
- review required flag

### Limitations

- never invents sections
- never gives final legal approval
- must mark uncertain section suggestions for review

---

## 3. Analytics Agent

### Purpose

Behave like a crime analyst using trends, patterns, and statistical signals.

### Responsibilities

- crime trends
- district comparison
- hotspot context
- victim statistics
- crime forecasting inputs
- attention summary inputs

### Tools

- `searchCrimeStatistics`
- `aggregateCrimeStatistics`
- `searchHotspots`
- `searchRiskScores`
- `searchVictimDemographics`
- `searchCrimeReviewReports`
- `forecastCrime`

### Output

- trend series
- comparative metrics
- district / unit ranking
- hotspot justification
- forecast summary
- data-quality warnings

### Limitations

- should prefer deterministic/statistical methods over LLM reasoning
- should flag thin datasets or provisional reports

---

## 4. Graph Agent

### Purpose

Behave like a relationship analyst.

### Responsibilities

- person connections
- phone / vehicle / case linkage
- graph expansion
- shortest path support
- cluster context
- network summarization

### Tools

- `searchGraphNodes`
- `getCaseGraph`
- `expandGraphNode`
- `findShortestPath`
- `runNetworkAnalysis`

### Output

- node list
- edge list
- interpreted connections
- inferred-vs-confirmed separation
- cluster summary
- confidence notes

### Limitations

- inferred links must be labeled
- must not overstate weak or unreviewed graph edges

---

## 5. Recommendation Agent

### Purpose

Behave like an investigation advisor.

### Responsibilities

- possible sections
- missing evidence
- possible witnesses
- prior similar FIR reference
- operational next-best actions
- priority scoring

### Tools

- `searchRecommendations`
- `getRiskScores`
- `findSimilarCases`
- `searchEvidenceGaps`
- `searchHotspots`
- `searchGraphSignals`

### Output

- prioritized recommendations
- rationale
- supporting evidence
- missing information
- action urgency
- review requirement

### Limitations

- recommendations are advisory only
- must expose uncertainty and evidence gaps

---

## 6. Report Agent

### Purpose

Behave like a briefing and documentation specialist.

### Responsibilities

- case summary
- supervisor brief
- station report
- crime review narrative
- PDF-ready brief text
- export-friendly summaries

### Tools

- `getCaseDetail`
- `getCaseTimeline`
- `getRecommendations`
- `getAnalyticsSummary`
- `getGraphSummary`
- `renderReportTemplate`

### Output

- structured report sections
- briefing notes
- summary bullets
- appendix references

### Limitations

- should never fabricate missing evidence sections
- must show source references for analytical statements

---

## 7. Supervisor Agent

### Purpose

Behave like a supervisory operations analyst for SP/DSP/DGP-style users.

### Responsibilities

- pending cases
- officer workload
- delayed investigations
- high-risk cases
- attention dashboard
- emerging spikes and escalations

### Tools

- `getDashboardOverview`
- `getOfficerDashboard`
- `searchAlerts`
- `searchRiskScores`
- `searchRecommendations`
- `searchOverdueTasks`
- `searchHotspots`

### Output

- top attention items
- review queue
- workload summary
- escalation recommendations
- district / unit priority view

### Limitations

- must respect jurisdiction and role scope
- must not expose protected case details without permission

---

## Cross-Cutting Agent Rules

| Rule | Meaning |
|---|---|
| Tool-only access | Agents do not access raw database directly. |
| Structured outputs | Every agent returns machine-readable output. |
| Review-aware | Agents label outputs that require human review. |
| Citation-aware | Agents attach source references where available. |
| No guilt claims | Agents never declare legal guilt. |
| Separation of concerns | Legal Agent handles law, Analytics Agent handles numbers, Graph Agent handles links. |

## Suggested Improvement

Add an internal **Governance Agent** later as a non-user-facing validator that checks:

- hallucination risk
- jurisdiction leakage
- missing citations
- unsafe recommendations
- confidence/reason mismatch
