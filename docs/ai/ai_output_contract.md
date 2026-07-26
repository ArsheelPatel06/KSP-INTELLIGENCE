# AI Output Contract

Purpose: define one shared JSON contract for all AI-generated responses.

Every agent and the final orchestrator response should map to this contract so the frontend can render outputs consistently.

## Core Principle

Even when the answer is conversational, the payload should remain structured.

## Standard Response Contract

```json
{
  "requestId": "req_123",
  "query": "What sections apply to this FIR?",
  "intent": {
    "primary": "legal_recommendation",
    "secondary": "fir_validation"
  },
  "context": {
    "caseMasterId": 1001,
    "districtId": 4,
    "unitId": 12,
    "role": "INSPECTOR"
  },
  "summary": "Possible theft-from-dwelling and intimidation elements are present.",
  "evidence": [
    {
      "type": "case",
      "sourceId": "case:1001",
      "label": "FIR-2026-001",
      "detail": "Narrative mentions house entry, jewellery theft, and threat.",
      "confidence": 1.0,
      "reviewStatus": "official"
    }
  ],
  "connections": [
    {
      "type": "graph_link",
      "label": "Case linked to 2 similar burglary cases",
      "confidence": 0.78,
      "isInferred": true
    }
  ],
  "insights": [
    "Narrative strongly supports a property offence pattern.",
    "Threat element needs confirmation details from complainant statement."
  ],
  "recommendations": [
    {
      "type": "legal",
      "title": "Review IPC 380 applicability",
      "reason": "Theft in dwelling house indicators found.",
      "supportingFacts": ["entered house", "stole jewellery"],
      "missingFacts": ["exact entry method"],
      "priority": "High",
      "confidence": 0.82,
      "reviewRequired": true
    }
  ],
  "suggestedLeads": [
    "Confirm intimidation details in witness statement.",
    "Compare with similar night burglary FIRs from the same station."
  ],
  "confidence": {
    "label": "Medium",
    "score": 0.74,
    "reason": "Strong theft indicators are present, but some legal facts remain incomplete."
  },
  "explainability": {
    "agentsUsed": ["investigation", "legal", "recommendation"],
    "toolsUsed": [
      "getCaseDetail",
      "recommendSectionsFromNarrative",
      "findSimilarCases"
    ],
    "whyThisAnswer": [
      "Case narrative matched known theft indicators.",
      "Legal retrieval found relevant dwelling-house theft section.",
      "Missing facts reduced final confidence."
    ],
    "humanReviewRequired": true
  },
  "nextAction": "Send recommendation for SHO / legal review after verifying threat details.",
  "warnings": [
    "Some legal facts are incomplete.",
    "Graph links shown as inferred require review."
  ]
}
```

## Mandatory Fields

- `summary`
- `evidence`
- `confidence`
- `explainability`
- `nextAction`
- `warnings`

## Evidence Item Contract

Each evidence item should contain:

- `type`
- `sourceId`
- `label`
- `detail`
- `confidence`
- `reviewStatus`

## Recommendation Item Contract

Each recommendation should contain:

- `type`
- `title`
- `reason`
- `supportingFacts`
- `missingFacts`
- `priority`
- `confidence`
- `reviewRequired`

## Confidence Contract

```json
{
  "label": "Low | Medium | High",
  "score": 0.0,
  "reason": "Why the score is what it is"
}
```

## Explainability Contract

```json
{
  "agentsUsed": [],
  "toolsUsed": [],
  "whyThisAnswer": [],
  "humanReviewRequired": true
}
```

## Output Modes

The same contract should support different UI modes.

| Mode       | Use Case                                                      |
| ---------- | ------------------------------------------------------------- |
| Chat       | conversational investigation assistant                        |
| Case panel | right-side evidence / recommendation rendering                |
| Dashboard  | compact supervisor insight cards                              |
| Report     | printable or exportable summary                               |
| Voice      | speech-friendly condensed answer + structured backend payload |

## Contract Rules

1. Never omit evidence for a recommendation.
2. Never return a recommendation without confidence.
3. Never return inferred graph connections without `isInferred` or equivalent warning.
4. Never return sensitive details without role checks.
5. Always include `humanReviewRequired` when legal/risk/inference outputs are involved.

## Suggested Improvement

Define agent-specific subcontracts that compile into this final contract.
That will let each agent stay simple while keeping the final UI payload uniform.
