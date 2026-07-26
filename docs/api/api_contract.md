# API Contract

Purpose: define REST API contracts for KSP Intelligence OS based on `master_schema.md`, `knowledge_graph.md`, `investigation_workflows.md`, `ai_reasoning_engine.md`, and `schema.sql`.

This document is product/API design only. It does not implement backend code.

## API Design Principles

- APIs serve the police operating system, not just database CRUD.
- Every investigation-facing response should support evidence, confidence, and next action where AI is involved.
- Official police entities remain authoritative.
- AI-generated outputs must include review status, model version, confidence, and explainability metadata.
- Sensitive values such as names, phone numbers, accounts, vehicle registrations, and victim information must be masked or role-controlled.
- All write operations must be auditable.
- APIs should be compatible with PostgreSQL-backed services and adaptable to Zoho Catalyst functions/DataStore.

## Base URL

```text
/api/v1
```

## Common Authentication

Unless marked public, every endpoint requires:

```http
Authorization: Bearer <access_token>
X-Request-Id: <unique-request-id>
```

Optional but recommended:

```http
X-User-Role: investigating_officer | sho | supervisor | crime_analyst | legal_officer | admin
X-Unit-Id: <unit_id>
X-District-Id: <district_id>
```

## Common Response Envelope

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-07-26T10:30:00Z",
    "source": "ksp-intelligence-os"
  },
  "errors": []
}
```

## Common Error Envelope

```json
{
  "success": false,
  "data": null,
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-07-26T10:30:00Z"
  },
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "caseMasterId is required",
      "field": "caseMasterId"
    }
  ]
}
```

## Common Pagination

Request query parameters:

```text
?page=1&pageSize=25&sort=createdAt:desc
```

Response metadata:

```json
{
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "totalRecords": 250,
    "totalPages": 10
  }
}
```

## Role-Based Authentication Matrix

| Role | Main Permissions |
|---|---|
| `investigating_officer` | View assigned cases, update investigation records, use AI assistant, create tasks. |
| `sho` | Approve/review FIRs, assign cases, review recommendations, view station dashboard. |
| `supervisor` | View district/subdivision cases, escalations, analytics, workload, hotspot alerts. |
| `crime_analyst` | View analytics, graph, hotspot, forecasting, anonymized case intelligence. |
| `legal_officer` | Review legal recommendations, chargesheet readiness, legal references. |
| `admin` | Manage users, roles, master data, source ingestion, configuration. |

---

# 1. Authentication APIs

## 1.1 Login

| Field | Value |
|---|---|
| Endpoint | `/auth/login` |
| Method | `POST` |
| Authentication | Public |

Request:

```json
{
  "username": "kgid_or_email",
  "password": "password",
  "mfaCode": "123456"
}
```

Response:

```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "expiresIn": 3600,
  "user": {
    "employeeId": 101,
    "name": "Officer Name",
    "role": "investigating_officer",
    "unitId": 12,
    "districtId": 4
  }
}
```

## 1.2 Refresh Token

| Field | Value |
|---|---|
| Endpoint | `/auth/refresh` |
| Method | `POST` |
| Authentication | Refresh token |

Request:

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

Response:

```json
{
  "accessToken": "new_jwt_access_token",
  "expiresIn": 3600
}
```

## 1.3 Logout

| Field | Value |
|---|---|
| Endpoint | `/auth/logout` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

Response:

```json
{
  "loggedOut": true
}
```

## 1.4 Current User Profile

| Field | Value |
|---|---|
| Endpoint | `/auth/me` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "employeeId": 101,
  "kgid": "KGID123",
  "name": "Officer Name",
  "role": "sho",
  "rank": "Inspector",
  "designation": "Station House Officer",
  "unitId": 12,
  "districtId": 4,
  "permissions": ["case:read", "case:assign", "ai:review"]
}
```

---

# 2. Cases APIs

## 2.1 List Cases

| Field | Value |
|---|---|
| Endpoint | `/cases` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
status=&districtId=&unitId=&crimeHeadId=&fromDate=&toDate=&riskLevel=&search=&page=&pageSize=
```

Response:

```json
{
  "cases": [
    {
      "caseMasterId": 1001,
      "crimeNo": "CR-2026-001",
      "caseNo": "FIR-2026-001",
      "registeredDate": "2026-01-05T09:30:00Z",
      "district": "Bengaluru City",
      "unit": "Whitefield PS",
      "crimeHead": "Burglary",
      "status": "Under Investigation",
      "riskLevel": "High",
      "assignedOfficer": "Officer Name"
    }
  ]
}
```

## 2.2 Create FIR / Case

| Field | Value |
|---|---|
| Endpoint | `/cases` |
| Method | `POST` |
| Authentication | Required: `investigating_officer`, `sho` |

Request:

```json
{
  "crimeRegisteredDate": "2026-01-05T09:30:00Z",
  "policeStationId": 12,
  "caseCategoryId": 1,
  "gravityOffenceId": 2,
  "crimeMajorHeadId": 8,
  "crimeMinorHeadId": 33,
  "incidentFromDate": "2026-01-04T23:00:00Z",
  "incidentToDate": "2026-01-05T01:00:00Z",
  "latitude": 12.9698,
  "longitude": 77.7500,
  "briefFacts": "Complainant states jewellery was stolen from house at night.",
  "complainants": [
    {
      "nameHash": "hash_value",
      "ageYear": 45,
      "genderId": 1,
      "occupationId": 10
    }
  ],
  "victims": [],
  "accused": [],
  "actSections": [
    {
      "actCode": "IPC",
      "sectionCode": "380"
    }
  ]
}
```

Response:

```json
{
  "caseMasterId": 1001,
  "crimeNo": "CR-2026-001",
  "caseNo": "FIR-2026-001",
  "status": "Draft",
  "validationStatus": "pending"
}
```

## 2.3 Get Case Detail

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "caseMasterId": 1001,
  "crimeNo": "CR-2026-001",
  "caseNo": "FIR-2026-001",
  "briefFacts": "Case narrative...",
  "status": "Under Investigation",
  "district": { "districtId": 4, "name": "Bengaluru City" },
  "unit": { "unitId": 12, "name": "Whitefield PS" },
  "crimeHead": { "crimeHeadId": 8, "name": "Burglary" },
  "victims": [],
  "accused": [],
  "actSections": [],
  "riskSummary": {
    "riskLevel": "High",
    "scoreValue": 82.4,
    "explanation": "Night-time house burglary in active hotspot."
  }
}
```

## 2.4 Update Case

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}` |
| Method | `PATCH` |
| Authentication | Required: assigned IO, `sho`, `supervisor` |

Request:

```json
{
  "caseStatusId": 3,
  "briefFacts": "Updated narrative",
  "crimeMajorHeadId": 8,
  "crimeMinorHeadId": 33,
  "latitude": 12.9698,
  "longitude": 77.7500
}
```

Response:

```json
{
  "caseMasterId": 1001,
  "updated": true,
  "updatedAt": "2026-01-05T11:00:00Z"
}
```

## 2.5 Validate FIR

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/validate` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "validationMode": "full",
  "includeLegalSuggestions": true,
  "includeMissingFields": true
}
```

Response:

```json
{
  "caseMasterId": 1001,
  "validationScore": 78,
  "missingFields": ["property value", "exact incident time", "witness details"],
  "warnings": [
    {
      "type": "LEGAL_REVIEW",
      "message": "Narrative mentions threat; criminal intimidation review may be required.",
      "confidence": 0.71
    }
  ],
  "suggestedActions": ["Add property details", "Request SHO/legal review"]
}
```

## 2.6 Case Timeline

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/timeline` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "caseMasterId": 1001,
  "timeline": [
    {
      "eventType": "FIR_REGISTERED",
      "eventTime": "2026-01-05T09:30:00Z",
      "title": "FIR registered",
      "description": "Case registered at Whitefield PS",
      "source": "case_master"
    }
  ],
  "pendingActions": ["Forensic report pending", "Witness statement missing"]
}
```

## 2.7 Add Case Diary Entry

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/diary` |
| Method | `POST` |
| Authentication | Required: assigned IO, `sho` |

Request:

```json
{
  "entryType": "investigation_note",
  "entryText": "Visited scene and collected CCTV footage.",
  "actionTaken": "Collected CCTV",
  "nextAction": "Identify vehicle from footage",
  "sensitivityLevel": "restricted"
}
```

Response:

```json
{
  "caseDiaryEntryId": 501,
  "caseMasterId": 1001,
  "created": true
}
```

## 2.8 Assign Case

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/assignment` |
| Method | `POST` |
| Authentication | Required: `sho`, `supervisor` |

Request:

```json
{
  "assignedToEmployeeId": 101,
  "assignmentReason": "Officer has burglary investigation experience.",
  "createInitialTasks": true
}
```

Response:

```json
{
  "caseMasterId": 1001,
  "assignedToEmployeeId": 101,
  "tasksCreated": 4
}
```

## 2.9 Get Similar Cases

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/similar` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
limit=10&minScore=0.65&similarityType=mo_location_legal
```

Response:

```json
{
  "caseMasterId": 1001,
  "similarCases": [
    {
      "matchedCaseMasterId": 950,
      "similarityScore": 0.84,
      "similarityType": "modus_operandi",
      "reasonFeatures": ["night-time entry", "jewellery theft", "same beat"],
      "reviewStatus": "pending"
    }
  ]
}
```

---

# 3. Victims APIs

## 3.1 List Victims for Case

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/victims` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "victims": [
    {
      "victimMasterId": 201,
      "ageYear": 45,
      "gender": "Female",
      "victimPolice": false,
      "riskLevel": "Medium"
    }
  ]
}
```

## 3.2 Add Victim

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/victims` |
| Method | `POST` |
| Authentication | Required: assigned IO, `sho` |

Request:

```json
{
  "victimNameHash": "hash_value",
  "ageYear": 45,
  "genderId": 2,
  "victimPolice": false
}
```

Response:

```json
{
  "victimMasterId": 201,
  "created": true
}
```

## 3.3 Get Victim Profile

| Field | Value |
|---|---|
| Endpoint | `/victims/{victimMasterId}/profile` |
| Method | `GET` |
| Authentication | Required; sensitive access controlled |

Response:

```json
{
  "victimMasterId": 201,
  "caseCount": 1,
  "vulnerabilityIndicators": ["elderly", "financial fraud victim"],
  "repeatVictimization": false,
  "connectedCases": [],
  "recommendedSupportActions": ["Record detailed statement", "Provide cyber fraud guidance"],
  "confidence": "Medium"
}
```

## 3.4 Victim Analytics

| Field | Value |
|---|---|
| Endpoint | `/victims/analytics` |
| Method | `GET` |
| Authentication | Required: `crime_analyst`, `supervisor`, `sho` |

Query Parameters:

```text
districtId=&crimeHeadId=&fromYear=&toYear=&gender=&ageBand=
```

Response:

```json
{
  "summary": {
    "totalVictims": 1240,
    "topAgeBand": "18-30",
    "topCrimeContext": "kidnapping/abduction"
  },
  "breakdown": []
}
```

---

# 4. Accused APIs

## 4.1 List Accused for Case

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/accused` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "accused": [
    {
      "accusedMasterId": 301,
      "personId": "A1",
      "ageYear": 32,
      "gender": "Male",
      "repeatOffenderProfileId": 55,
      "riskLevel": "High"
    }
  ]
}
```

## 4.2 Add Accused

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/accused` |
| Method | `POST` |
| Authentication | Required: assigned IO, `sho` |

Request:

```json
{
  "accusedNameHash": "hash_value",
  "ageYear": 32,
  "genderId": 1,
  "personId": "A1"
}
```

Response:

```json
{
  "accusedMasterId": 301,
  "created": true
}
```

## 4.3 Get Accused Profile

| Field | Value |
|---|---|
| Endpoint | `/accused/{accusedMasterId}/profile` |
| Method | `GET` |
| Authentication | Required; sensitive access controlled |

Response:

```json
{
  "accusedMasterId": 301,
  "linkedCases": 3,
  "repeatOffenderProfile": {
    "repeatOffenderProfileId": 55,
    "identityConfidence": 0.86,
    "riskLevel": "High"
  },
  "gangLinks": [],
  "phones": [],
  "vehicles": [],
  "financialAccounts": [],
  "recommendedLeads": ["Verify address history", "Review linked burglary cases"]
}
```

## 4.4 Repeat Offender Search

| Field | Value |
|---|---|
| Endpoint | `/accused/repeat-offenders/search` |
| Method | `POST` |
| Authentication | Required: `sho`, `supervisor`, `crime_analyst`, assigned IO |

Request:

```json
{
  "nameHash": "hash_value",
  "phoneHash": "hash_phone",
  "vehicleHash": "hash_vehicle",
  "districtId": 4,
  "minConfidence": 0.7
}
```

Response:

```json
{
  "matches": [
    {
      "repeatOffenderProfileId": 55,
      "matchConfidence": 0.86,
      "matchReasons": ["name hash", "same vehicle", "same district"],
      "reviewStatus": "pending"
    }
  ]
}
```

---

# 5. Officers APIs

## 5.1 List Officers

| Field | Value |
|---|---|
| Endpoint | `/officers` |
| Method | `GET` |
| Authentication | Required: `sho`, `supervisor`, `admin` |

Query Parameters:

```text
districtId=&unitId=&rankId=&designationId=&active=true&search=
```

Response:

```json
{
  "officers": [
    {
      "employeeId": 101,
      "kgid": "KGID123",
      "name": "Officer Name",
      "rank": "PSI",
      "designation": "Investigating Officer",
      "unit": "Whitefield PS"
    }
  ]
}
```

## 5.2 Officer Workload

| Field | Value |
|---|---|
| Endpoint | `/officers/{employeeId}/workload` |
| Method | `GET` |
| Authentication | Required: self, `sho`, `supervisor` |

Response:

```json
{
  "employeeId": 101,
  "activeCases": 12,
  "overdueTasks": 3,
  "pendingReviews": 2,
  "highRiskCases": 4,
  "workloadLevel": "High",
  "recommendation": "Avoid assigning additional high-gravity cases today."
}
```

## 5.3 Officer Tasks

| Field | Value |
|---|---|
| Endpoint | `/officers/{employeeId}/tasks` |
| Method | `GET` |
| Authentication | Required: self, `sho`, `supervisor` |

Response:

```json
{
  "tasks": [
    {
      "taskId": 901,
      "caseMasterId": 1001,
      "title": "Collect CCTV footage",
      "priority": "High",
      "dueDate": "2026-01-07",
      "status": "open"
    }
  ]
}
```

---

# 6. Acts APIs

## 6.1 List Acts

| Field | Value |
|---|---|
| Endpoint | `/acts` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
search=&active=true&page=&pageSize=
```

Response:

```json
{
  "acts": [
    {
      "actCode": "IPC",
      "shortName": "IPC",
      "description": "Indian Penal Code",
      "active": true
    }
  ]
}
```

## 6.2 Get Act Detail

| Field | Value |
|---|---|
| Endpoint | `/acts/{actCode}` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "actCode": "IPC",
  "shortName": "IPC",
  "description": "Indian Penal Code",
  "sectionsCount": 456,
  "legalSources": []
}
```

## 6.3 List Sections for Act

| Field | Value |
|---|---|
| Endpoint | `/acts/{actCode}/sections` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "sections": [
    {
      "actCode": "IPC",
      "sectionCode": "380",
      "description": "Theft in dwelling house..."
    }
  ]
}
```

---

# 7. IPC APIs

## 7.1 Search IPC / Legal Sections

| Field | Value |
|---|---|
| Endpoint | `/ipc/search` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
q=theft in house&actCode=IPC&limit=10
```

Response:

```json
{
  "results": [
    {
      "actCode": "IPC",
      "sectionCode": "380",
      "title": "Theft in dwelling house",
      "description": "...",
      "punishment": "...",
      "score": 0.91
    }
  ]
}
```

## 7.2 Get IPC Section Detail

| Field | Value |
|---|---|
| Endpoint | `/ipc/{sectionCode}` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
actCode=IPC
```

Response:

```json
{
  "actCode": "IPC",
  "sectionCode": "380",
  "description": "...",
  "offenseText": "...",
  "punishmentText": "...",
  "keywords": ["theft", "dwelling house"],
  "relatedCrimeHeads": ["Burglary", "Theft"]
}
```

## 7.3 Recommend Legal Sections from Text

| Field | Value |
|---|---|
| Endpoint | `/ipc/recommend` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "caseMasterId": 1001,
  "narrative": "Person entered house at night and stole jewellery while threatening owner.",
  "crimeHeadId": 8,
  "includeSimilarCases": true
}
```

Response:

```json
{
  "recommendations": [
    {
      "actCode": "IPC",
      "sectionCode": "380",
      "reason": "Narrative indicates theft from a dwelling house.",
      "supportingFacts": ["entered house", "stole jewellery"],
      "missingFacts": ["entry method", "property value"],
      "confidence": 0.82,
      "reviewRequired": true
    }
  ]
}
```

---

# 8. Analytics APIs

## 8.1 Crime Trend

| Field | Value |
|---|---|
| Endpoint | `/analytics/crime-trends` |
| Method | `GET` |
| Authentication | Required: `crime_analyst`, `sho`, `supervisor` |

Query Parameters:

```text
districtId=&unitId=&crimeHeadId=&fromYear=&fromMonth=&toYear=&toMonth=
```

Response:

```json
{
  "scope": {
    "districtId": 4,
    "crimeHeadId": 8,
    "from": "2025-01",
    "to": "2026-06"
  },
  "series": [
    { "month": "2026-01", "count": 120 }
  ],
  "trendDirection": "increasing",
  "dataQualityWarnings": []
}
```

## 8.2 District Comparison

| Field | Value |
|---|---|
| Endpoint | `/analytics/district-comparison` |
| Method | `GET` |
| Authentication | Required: `crime_analyst`, `supervisor` |

Query Parameters:

```text
crimeHeadId=&year=&month=&metric=currentMonthCount
```

Response:

```json
{
  "districts": [
    {
      "districtId": 4,
      "districtName": "Bengaluru City",
      "value": 120,
      "rank": 1
    }
  ]
}
```

## 8.3 Forecast Crime

| Field | Value |
|---|---|
| Endpoint | `/analytics/forecast` |
| Method | `POST` |
| Authentication | Required: `crime_analyst`, `supervisor` |

Request:

```json
{
  "districtId": 4,
  "unitId": 12,
  "crimeHeadId": 8,
  "forecastMonths": 3,
  "modelVersion": "forecast-v1"
}
```

Response:

```json
{
  "forecast": [
    {
      "period": "2026-08",
      "expectedCount": 132,
      "confidenceInterval": { "low": 110, "high": 150 }
    }
  ],
  "drivers": ["recent increase", "seasonal night burglary pattern"],
  "recommendedActions": ["Increase night patrol in hotspot units"]
}
```

## 8.4 Operational Attention Summary

| Field | Value |
|---|---|
| Endpoint | `/analytics/attention-summary` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
districtId=&unitId=&date=2026-07-26
```

Response:

```json
{
  "today": {
    "criticalAlerts": 3,
    "highRiskCases": 8,
    "pendingReviews": 6,
    "overdueTasks": 12,
    "emergingHotspots": 2
  },
  "topItems": []
}
```

---

# 9. Hotspots APIs

## 9.1 List Hotspots

| Field | Value |
|---|---|
| Endpoint | `/hotspots` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
districtId=&unitId=&crimeHeadId=&riskLevel=&fromDate=&toDate=
```

Response:

```json
{
  "hotspots": [
    {
      "hotspotId": 701,
      "name": "Whitefield Night Burglary Cluster",
      "districtId": 4,
      "unitId": 12,
      "riskLevel": "High",
      "centerLatitude": 12.9698,
      "centerLongitude": 77.7500,
      "confidenceScore": 0.88,
      "trendDirection": "increasing"
    }
  ]
}
```

## 9.2 Get Hotspot Detail

| Field | Value |
|---|---|
| Endpoint | `/hotspots/{hotspotId}` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "hotspotId": 701,
  "name": "Whitefield Night Burglary Cluster",
  "riskLevel": "High",
  "contributingCases": [],
  "crimeHead": "Burglary",
  "recommendedPatrolWindow": "21:00-02:00",
  "explanation": "Multiple night burglary cases in same beat over 30 days."
}
```

## 9.3 Generate Hotspot Recommendation

| Field | Value |
|---|---|
| Endpoint | `/hotspots/{hotspotId}/recommendations` |
| Method | `POST` |
| Authentication | Required: `sho`, `supervisor`, `crime_analyst` |

Request:

```json
{
  "recommendationType": "patrol",
  "includeContributingCases": true
}
```

Response:

```json
{
  "recommendationId": 801,
  "recommendationText": "Increase night patrol in selected beat between 21:00 and 02:00.",
  "confidenceScore": 0.84,
  "priorityLevel": "High",
  "reviewRequired": true
}
```

---

# 10. Recommendations APIs

## 10.1 List Recommendations

| Field | Value |
|---|---|
| Endpoint | `/recommendations` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
caseMasterId=&hotspotId=&type=&status=&priorityLevel=&reviewedBy=
```

Response:

```json
{
  "recommendations": [
    {
      "recommendationId": 801,
      "caseMasterId": 1001,
      "type": "legal",
      "text": "Review possible criminal intimidation section.",
      "confidenceScore": 0.74,
      "priorityLevel": "Medium",
      "status": "pending"
    }
  ]
}
```

## 10.2 Get Recommendation Detail

| Field | Value |
|---|---|
| Endpoint | `/recommendations/{recommendationId}` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "recommendationId": 801,
  "recommendationType": "legal",
  "recommendationText": "Review possible criminal intimidation section.",
  "rationaleText": "FIR narrative mentions threatening the owner.",
  "confidenceScore": 0.74,
  "evidence": [],
  "legalSections": [],
  "reviewStatus": "pending",
  "modelVersion": "legal-reasoner-v1"
}
```

## 10.3 Review Recommendation

| Field | Value |
|---|---|
| Endpoint | `/recommendations/{recommendationId}/review` |
| Method | `POST` |
| Authentication | Required: `sho`, `supervisor`, `legal_officer` |

Request:

```json
{
  "decision": "accepted",
  "reviewNotes": "Section should be added after confirming threat details.",
  "createTask": true
}
```

Response:

```json
{
  "recommendationId": 801,
  "status": "accepted",
  "reviewedByEmployeeId": 101,
  "taskId": 901
}
```

## 10.4 Generate Case Recommendation

| Field | Value |
|---|---|
| Endpoint | `/cases/{caseMasterId}/recommendations/generate` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "recommendationTypes": ["legal", "investigation", "evidence_gap"],
  "includeGraph": true,
  "includeSimilarCases": true
}
```

Response:

```json
{
  "caseMasterId": 1001,
  "recommendations": [
    {
      "recommendationId": 801,
      "type": "investigation",
      "text": "Collect CCTV footage from incident area.",
      "confidenceScore": 0.86,
      "priorityLevel": "High"
    }
  ]
}
```

---

# 11. Graph APIs

## 11.1 Get Case Graph

| Field | Value |
|---|---|
| Endpoint | `/graph/cases/{caseMasterId}` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
depth=2&includeEvidence=true&includeInferred=false
```

Response:

```json
{
  "nodes": [
    {
      "id": "case:1001",
      "label": "Case",
      "displayName": "FIR-2026-001",
      "qualityStatus": "trusted"
    }
  ],
  "edges": [
    {
      "from": "case:1001",
      "to": "accused:301",
      "type": "HAS_ACCUSED",
      "confidenceScore": 1.0,
      "reviewStatus": "accepted"
    }
  ]
}
```

## 11.2 Expand Graph Node

| Field | Value |
|---|---|
| Endpoint | `/graph/nodes/{nodeId}/expand` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
relationshipTypes=&depth=1&limit=50&minConfidence=0.6
```

Response:

```json
{
  "centerNodeId": "phone:abc123",
  "nodes": [],
  "edges": [],
  "warnings": ["Some inferred links require review."]
}
```

## 11.3 Find Shortest Path

| Field | Value |
|---|---|
| Endpoint | `/graph/path` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "fromNodeId": "accused:301",
  "toNodeId": "gang:20",
  "maxDepth": 5,
  "minConfidence": 0.6,
  "includeInferred": true
}
```

Response:

```json
{
  "pathFound": true,
  "paths": [
    {
      "pathScore": 0.78,
      "nodes": [],
      "edges": [],
      "interpretation": "Accused is connected to gang through repeat offender profile and one reviewed member link."
    }
  ]
}
```

## 11.4 Network Analysis

| Field | Value |
|---|---|
| Endpoint | `/graph/network-analysis` |
| Method | `POST` |
| Authentication | Required: `crime_analyst`, `supervisor`, assigned IO |

Request:

```json
{
  "seedNodeIds": ["case:1001"],
  "algorithm": "connected_components",
  "depth": 3,
  "filters": {
    "relationshipTypes": ["HAS_ACCUSED", "USES_PHONE_OR_DIGITAL_ID", "INVOLVES_VEHICLE"],
    "minConfidence": 0.7
  }
}
```

Response:

```json
{
  "algorithm": "connected_components",
  "clusters": [
    {
      "clusterId": "cluster_1",
      "nodeCount": 18,
      "edgeCount": 24,
      "keyNodes": [],
      "summary": "Cluster connects 4 burglary cases through shared vehicle and phone identifiers."
    }
  ]
}
```

---

# 12. Chat APIs

## 12.1 Create Chat Session

| Field | Value |
|---|---|
| Endpoint | `/chat/sessions` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "caseMasterId": 1001,
  "sessionPurpose": "case_investigation",
  "securityClassification": "restricted"
}
```

Response:

```json
{
  "chatSessionId": 10001,
  "caseMasterId": 1001,
  "startedOn": "2026-07-26T10:30:00Z"
}
```

## 12.2 Send Chat Message

| Field | Value |
|---|---|
| Endpoint | `/chat/sessions/{chatSessionId}/messages` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "messageText": "What sections apply to this FIR?",
  "includeEvidence": true,
  "includeGraph": true,
  "includeLegal": true,
  "includeAnalytics": false
}
```

Response:

```json
{
  "chatMessageId": 11001,
  "answer": {
    "summary": "The FIR indicates possible theft from dwelling house and may require intimidation review.",
    "evidence": [],
    "connections": [],
    "insights": [],
    "suggestedLeads": ["Confirm threat details", "Record property value"],
    "confidence": {
      "label": "Medium",
      "score": 0.74,
      "reason": "Strong theft facts, but threat details incomplete."
    },
    "nextAction": "Send legal recommendation for SHO/legal review"
  },
  "linkedRecommendationIds": [801],
  "auditLogId": 5010
}
```

## 12.3 List Chat Sessions

| Field | Value |
|---|---|
| Endpoint | `/chat/sessions` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
caseMasterId=&employeeId=&fromDate=&toDate=
```

Response:

```json
{
  "sessions": [
    {
      "chatSessionId": 10001,
      "caseMasterId": 1001,
      "sessionPurpose": "case_investigation",
      "startedOn": "2026-07-26T10:30:00Z",
      "messageCount": 5
    }
  ]
}
```

## 12.4 Get Chat Session Messages

| Field | Value |
|---|---|
| Endpoint | `/chat/sessions/{chatSessionId}` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "chatSessionId": 10001,
  "messages": [
    {
      "sequence": 1,
      "senderRole": "user",
      "messageText": "Find similar FIRs.",
      "createdOn": "2026-07-26T10:31:00Z"
    }
  ]
}
```

---

# 13. Reports APIs

## 13.1 List Crime Review Reports

| Field | Value |
|---|---|
| Endpoint | `/reports/crime-review` |
| Method | `GET` |
| Authentication | Required |

Query Parameters:

```text
year=&month=&sourceType=&page=&pageSize=
```

Response:

```json
{
  "reports": [
    {
      "crimeReviewReportId": 601,
      "title": "Crime Review December 2025",
      "reportMonth": 12,
      "reportYear": 2025,
      "isProvisional": true
    }
  ]
}
```

## 13.2 Get Crime Review Report

| Field | Value |
|---|---|
| Endpoint | `/reports/crime-review/{reportId}` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "crimeReviewReportId": 601,
  "title": "Crime Review December 2025",
  "summaryText": "...",
  "sections": [
    {
      "sectionTitle": "Murder",
      "narrativeText": "...",
      "relatedCrimeHead": "Murder"
    }
  ]
}
```

## 13.3 Generate Case Report

| Field | Value |
|---|---|
| Endpoint | `/reports/cases/{caseMasterId}/generate` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "reportType": "supervisor_brief",
  "includeTimeline": true,
  "includeEvidence": true,
  "includeRecommendations": true,
  "includeGraphSummary": true
}
```

Response:

```json
{
  "reportId": "generated_report_123",
  "caseMasterId": 1001,
  "title": "Supervisor Brief - FIR-2026-001",
  "summary": "...",
  "sections": [],
  "downloadUrl": "/api/v1/export/reports/generated_report_123.pdf"
}
```

---

# 14. Export APIs

## 14.1 Export Case

| Field | Value |
|---|---|
| Endpoint | `/export/cases/{caseMasterId}` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "format": "pdf",
  "includeEvidence": true,
  "includeTimeline": true,
  "includeLegalRecommendations": true,
  "redactionLevel": "role_based"
}
```

Response:

```json
{
  "exportJobId": "exp_1001",
  "status": "queued",
  "downloadUrl": null
}
```

## 14.2 Export Analytics

| Field | Value |
|---|---|
| Endpoint | `/export/analytics` |
| Method | `POST` |
| Authentication | Required: `crime_analyst`, `supervisor` |

Request:

```json
{
  "format": "csv",
  "reportName": "district_crime_trends",
  "filters": {
    "districtId": 4,
    "crimeHeadId": 8,
    "fromYear": 2025,
    "toYear": 2026
  }
}
```

Response:

```json
{
  "exportJobId": "exp_analytics_001",
  "status": "queued"
}
```

## 14.3 Get Export Job Status

| Field | Value |
|---|---|
| Endpoint | `/export/jobs/{exportJobId}` |
| Method | `GET` |
| Authentication | Required |

Response:

```json
{
  "exportJobId": "exp_1001",
  "status": "completed",
  "downloadUrl": "/downloads/exp_1001.pdf",
  "expiresAt": "2026-07-27T10:30:00Z"
}
```

---

# 15. Voice APIs

## 15.1 Speech to Text

| Field | Value |
|---|---|
| Endpoint | `/voice/transcribe` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "audioFileReference": "file_123",
  "languageCode": "kn-IN",
  "caseMasterId": 1001,
  "purpose": "fir_narrative"
}
```

Response:

```json
{
  "transcriptId": "tr_123",
  "languageCode": "kn-IN",
  "transcriptText": "Kannada or translated text...",
  "confidenceScore": 0.89,
  "requiresReview": true
}
```

## 15.2 Translate Transcript

| Field | Value |
|---|---|
| Endpoint | `/voice/translate` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "transcriptId": "tr_123",
  "targetLanguageCode": "en-IN"
}
```

Response:

```json
{
  "transcriptId": "tr_123",
  "translatedText": "Translated English text...",
  "confidenceScore": 0.84,
  "requiresReview": true
}
```

## 15.3 Voice Query to AI

| Field | Value |
|---|---|
| Endpoint | `/voice/query` |
| Method | `POST` |
| Authentication | Required |

Request:

```json
{
  "audioFileReference": "file_456",
  "languageCode": "kn-IN",
  "caseMasterId": 1001,
  "includeEvidence": true
}
```

Response:

```json
{
  "transcriptText": "Find similar FIRs for this case.",
  "detectedIntent": "similar_case_discovery",
  "answer": {
    "summary": "Found 3 similar burglary cases.",
    "evidence": [],
    "suggestedLeads": [],
    "confidence": {
      "label": "Medium",
      "score": 0.78
    }
  }
}
```

---

# Cross-Cutting API Requirements

## Authentication and Authorization

- Every endpoint must validate access token.
- Role and jurisdiction filtering must be applied server-side.
- Sensitive victim, child, sexual offence, phone, account, and identity details require elevated permission.
- AI-generated sensitive outputs must be logged.

## Audit Requirements

All write/review/AI endpoints should record:

- employee ID
- timestamp
- request ID
- entity changed
- old/new status where applicable
- model version for AI-generated output
- review decision where applicable

## AI Response Requirements

AI endpoints should return:

```json
{
  "summary": "...",
  "evidence": [],
  "connections": [],
  "insights": [],
  "suggestedLeads": [],
  "confidence": {
    "label": "Medium",
    "score": 0.74,
    "reason": "..."
  },
  "explainability": {
    "sourcesUsed": [],
    "modelVersion": "...",
    "retrievalIds": [],
    "humanReviewRequired": true
  },
  "nextAction": "..."
}
```

## Status Codes

| Code | Meaning |
|---:|---|
| `200` | Success |
| `201` | Created |
| `202` | Accepted/queued |
| `400` | Validation error |
| `401` | Unauthenticated |
| `403` | Unauthorized or jurisdiction restricted |
| `404` | Not found |
| `409` | Conflict/duplicate |
| `422` | Business rule violation |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

## API Groups Summary

| Group | Main Purpose |
|---|---|
| Authentication | Login, refresh, profile, logout. |
| Cases | FIR registration, validation, timeline, assignment, similarity. |
| Victims | Victim records, victim profile, vulnerability analytics. |
| Accused | Accused records, criminal profile, repeat offender search. |
| Officers | Officer directory, workload, assigned tasks. |
| Acts | Legal act and section browsing. |
| IPC | IPC/legal search and legal recommendation. |
| Analytics | Crime trends, comparison, forecasting, attention dashboard. |
| Hotspots | Hotspot monitoring and patrol recommendations. |
| Recommendations | AI recommendations and human review. |
| Graph | Case graph, node expansion, shortest path, network analysis. |
| Chat | AI investigation sessions and messages. |
| Reports | Crime review reports and generated case reports. |
| Export | PDF/CSV/report export jobs. |
| Voice | Kannada/English voice transcription, translation, and voice queries. |
