# Tool Registry

Purpose: define every callable AI tool and its contract.

The LLM must never execute SQL directly.
It only calls tools.

## Tool Design Principles

- Tools are explicit functions.
- Each tool has one clear purpose.
- Input/output contracts are deterministic.
- Sensitive data is filtered before reaching the LLM.
- Tools may call services/repositories under the hood, but that is hidden from the model.

---

## 1. Case Tools

### `searchCases`

**Purpose:** Search cases by structured filters.

**Input:**
- `crimeNo?`
- `caseNo?`
- `districtId?`
- `unitId?`
- `status?`
- `query?`
- `page?`
- `pageSize?`

**Output:**
- case list
- pagination
- warnings

### `getCaseDetail`

**Purpose:** Fetch detailed case information.

**Input:**
- `caseMasterId`

**Output:**
- case detail
- related victims
- accused
- legal sections
- status
- evidence counts

### `getCaseTimeline`

**Purpose:** Build a chronological case timeline.

**Input:**
- `caseMasterId`

**Output:**
- ordered events
- event types
- source references

### `findSimilarCases`

**Purpose:** Retrieve similar FIRs or cases.

**Input:**
- `caseMasterId`
- `limit?`

**Output:**
- matched cases
- similarity score
- reason features

---

## 2. Victim / Accused / Officer Tools

### `searchVictims`

**Input:**
- `caseMasterId?`
- `districtId?`
- `genderId?`
- `query?`

**Output:**
- victim records
- risk context

### `searchAccused`

**Input:**
- `caseMasterId?`
- `personId?`
- `query?`

**Output:**
- accused records
- repeat offender indicators

### `searchOfficers`

**Input:**
- `employeeId?`
- `kgid?`
- `unitId?`
- `districtId?`

**Output:**
- officer records
- workload summary

---

## 3. Legal Tools

### `searchActs`

**Input:**
- `query?`
- `active?`
- `page?`
- `pageSize?`

**Output:**
- act list

### `searchIPCSections`

**Input:**
- `actCode?`
- `sectionCode?`
- `query?`
- `limit?`

**Output:**
- section matches
- descriptions
- punishment text

### `getSectionDetail`

**Input:**
- `actCode`
- `sectionCode`

**Output:**
- section detail
- keywords
- related legal references

### `searchLegalDocuments`

**Input:**
- `actCode?`
- `query?`

**Output:**
- legal docs
- source URLs

### `recommendSectionsFromNarrative`

**Input:**
- `caseMasterId?`
- `narrative`
- `crimeHeadId?`
- `includeSimilarCases?`

**Output:**
- suggested sections
- reasons
- supporting facts
- missing facts
- confidence

---

## 4. Graph Tools

### `searchGraphNodes`

**Input:**
- `sourceTable?`
- `nodeLabel?`
- `query?`
- `page?`
- `pageSize?`

**Output:**
- graph nodes

### `getCaseGraph`

**Input:**
- `caseMasterId`
- `depth?`
- `includeEvidence?`
- `includeInferred?`

**Output:**
- center node
- nodes
- edges
- warnings

### `expandGraphNode`

**Input:**
- `nodeId`
- `relationshipTypes?`
- `depth?`
- `limit?`
- `minConfidence?`

**Output:**
- expanded nodes
- edges

### `findShortestPath`

**Input:**
- `fromNodeId`
- `toNodeId`
- `maxDepth?`
- `minConfidence?`
- `includeInferred?`

**Output:**
- path list
- interpretation

### `runNetworkAnalysis`

**Input:**
- `seedNodeIds`
- `algorithm`
- `depth?`
- `filters?`

**Output:**
- clusters
- key nodes
- summaries

---

## 5. Analytics Tools

### `searchCrimeStatistics`

**Input:**
- `districtId?`
- `unitId?`
- `crimeHeadId?`
- `fromYear?`
- `toYear?`

**Output:**
- time series
- aggregate metrics

### `aggregateCrimeStatistics`

**Input:**
- same filtering scope as above

**Output:**
- totals
- current month / YTD / prior period metrics

### `searchHotspots`

**Input:**
- `districtId?`
- `unitId?`
- `riskLevel?`
- `crimeHeadId?`

**Output:**
- hotspot list
- map coordinates
- confidence

### `getHotspotDetail`

**Input:**
- `hotspotId`

**Output:**
- hotspot detail
- contributing cases
- risk scores
- existing recommendations

### `forecastCrime`

**Input:**
- `districtId?`
- `unitId?`
- `crimeHeadId?`
- `forecastMonths`

**Output:**
- forecast periods
- expected counts
- intervals
- drivers

---

## 6. Recommendation Tools

### `searchRecommendations`

**Input:**
- `caseMasterId?`
- `hotspotId?`
- `riskScoreId?`
- `status?`
- `priorityLevel?`

**Output:**
- recommendation list

### `getRecommendationDetail`

**Input:**
- `recommendationId`

**Output:**
- recommendation detail
- legal sections
- rationale
- review status

### `generateHotspotRecommendation`

**Input:**
- `hotspotId`
- `recommendationType?`
- `includeContributingCases?`

**Output:**
- generated or retrieved recommendation
- confidence
- priority

---

## 7. Chat / Memory Tools

### `createChatSession`

**Input:**
- `caseMasterId?`
- `sessionPurpose`
- `securityClassification?`

**Output:**
- chat session record

### `listChatSessions`

**Input:**
- `caseMasterId?`
- `employeeId?`
- `fromDate?`
- `toDate?`

**Output:**
- session list

### `getChatSessionMessages`

**Input:**
- `chatSessionId`

**Output:**
- message history

### `storeChatMessage`

**Input:**
- `chatSessionId`
- `senderRole`
- `messageText`
- `linkedRecommendationId?`

**Output:**
- stored message

---

## 8. Reporting Tools

### `renderCaseBrief`

**Input:**
- `caseMasterId`
- `includeTimeline?`
- `includeEvidence?`
- `includeRecommendations?`

**Output:**
- structured briefing payload

### `renderSupervisorSummary`

**Input:**
- `districtId?`
- `unitId?`
- `date?`

**Output:**
- top attention items
- workload summary
- risk summary

---

## Tool Governance Rules

1. Tools enforce role and jurisdiction constraints.
2. Tools return normalized, model-safe output.
3. Tools should include source identifiers when available.
4. Tools should expose warnings for low-quality or missing data.
5. Tools should never silently broaden scope beyond permissions.

## Suggested Improvement

Add a **Tool Reliability Score** later for each tool response:

- `freshness`
- `record_count`
- `source_quality`
- `masking_applied`
- `review_status`

This can feed the global confidence layer.
