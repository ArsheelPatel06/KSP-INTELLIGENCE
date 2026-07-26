# Feature Priority Roadmap

Purpose: prioritize KSP Intelligence OS features into hackathon MVP and future phases. This document prevents scope creep and keeps the team focused on building a deployable police intelligence prototype.

Reference documents:

- `docs/product/investigation_workflows.md`
- `docs/ai/ai_reasoning_engine.md`
- `docs/ai/ai_modules.md`
- `docs/api/api_contract.md`
- `docs/database/master_schema.md`
- `docs/database/knowledge_graph.md`
- `schema.sql`

## Priority Labels

| Label | Meaning |
|---|---|
| Critical | Must exist for the phase to be credible. |
| Optional | Useful if time permits; can be simplified. |
| Future | Not required now; document for later expansion. |

## Time Estimate Assumptions

Estimates assume a hackathon/prototype team and include design + implementation + demo polish.

| Estimate | Meaning |
|---|---|
| 0.5 day | Simple screen/API/static integration. |
| 1 day | Moderate feature with UI + backend or AI prompt integration. |
| 2 days | Complex feature needing multiple modules or careful UX. |
| 3+ days | Larger feature likely needs dedicated implementation and testing. |

## Product Strategy

The MVP should not try to build everything. The hackathon-winning path is:

```text
FIR / Case Data
    ↓
Legal + RAG Intelligence
    ↓
Case Similarity
    ↓
Knowledge Graph View
    ↓
AI Investigation Chat
    ↓
Crime Analytics + Hotspot Map
```

The demo should make judges feel:

> “This system understands investigations.”

Not:

> “This is another chatbot/dashboard.”

---

# Phase 1: Mandatory Hackathon MVP

Goal: build the smallest impressive version of KSP Intelligence OS that demonstrates police investigation intelligence.

## Phase 1 Feature Table

| Feature | Priority | Dependencies | Estimated Time | Notes |
|---|---|---|---:|---|
| Product landing / secure login mock | Critical | Basic auth/session | 0.5 day | Can be simplified for demo. |
| Home / Attention Dashboard | Critical | Case data, alerts/risk mock or computed data | 1 day | Must answer “What needs my attention today?” |
| Case List | Critical | `case_master`, filters | 0.5 day | Search by FIR/case, district, station, crime type. |
| Case Detail Page | Critical | Case, victim, accused, sections, evidence summary | 1 day | Central investigation workspace. |
| Case Timeline | Critical | Case events, diary/evidence/arrest mock data | 1 day | Very demo-friendly; shows investigation maturity. |
| FIR Validation Panel | Critical | FIR fields, legal recommender rules | 1 day | Show missing fields and warnings. |
| Legal Recommendation Module | Critical | IPC/legal sections, RAG retrieval, FIR narrative | 2 days | Biggest differentiator; must show reason + confidence. |
| AI Chat Investigation | Critical | Reasoning engine prompt, case context, RAG, evidence panel | 2 days | Flagship experience. Must not be generic chatbot. |
| Evidence Panel in Chat | Critical | Case evidence/retrieved sources | 1 day | Shows proof and trust. |
| Similar Case Discovery | Critical | Case embeddings or rule-based similarity | 1-2 days | Top 10 similar FIRs with reasons. |
| Basic Knowledge Graph View | Critical | Case-person-section-location relationships | 1-2 days | Use simple graph visualization; does not need full graph DB. |
| IPC / Legal Search | Critical | `ipc_sections`, `legal_document_source`, RAG chunks | 1 day | Search legal sections and explanations. |
| Crime Analytics Dashboard | Critical | Crime review aggregates | 1 day | Trends by month, district, crime head. |
| Crime Map / Hotspot Demo | Critical | Valid coordinates or synthetic hotspot layer | 1-2 days | Heatmap + hotspot explanation. |
| AI Recommendation Cards | Critical | Legal, investigation, hotspot recommendations | 1 day | Show confidence and review status. |
| Supervisor Review Queue | Optional | Recommendations, alerts, tasks | 1 day | Include if time permits; can be static-backed. |
| Export Case Summary PDF | Optional | Report generation | 0.5-1 day | Good demo closer but not core. |
| Voice Query Demo | Optional | Voice API/STT or browser speech | 1 day | Nice if stable; skip if unreliable. |
| User roles / permissions deep implementation | Optional | Auth | 1 day | Mock role-based UI if time constrained. |
| Full CRUD for every entity | Future | Backend maturity | 3+ days | Not needed for MVP. |

## Phase 1 Critical User Journey

```text
Officer logs in
    ↓
Dashboard shows high-risk burglary case and hotspot
    ↓
Officer opens case detail
    ↓
AI validates FIR and flags missing facts
    ↓
AI suggests legal sections with reasons
    ↓
Officer asks chat: “Find similar cases”
    ↓
AI shows similar FIRs and evidence panel
    ↓
Officer opens graph showing case-person-phone-location links
    ↓
Officer sees hotspot map and recommendation
    ↓
Supervisor review card shows pending AI recommendation
```

## Phase 1 Critical AI Modules

| AI Module | Priority | Dependencies | Estimated Time | MVP Approach |
|---|---|---|---:|---|
| Document RAG Retrieval | Critical | Legal/case chunks | 1-2 days | Use full-text + embeddings if available. |
| Legal Recommendation | Critical | IPC/legal search, FIR narrative | 2 days | Hybrid rules + RAG + LLM explanation. |
| Case Summarization | Critical | Case detail, timeline | 1 day | Template + LLM grounded summary. |
| Conversation | Critical | Reasoning engine, RAG, case context | 2 days | Intent routing + structured answer. |
| Case Similarity | Critical | FIR features, embeddings/rules | 1-2 days | Start with text + crime/location similarity. |
| FIR Validation | Critical | Required-field rules, legal module | 1 day | Rule-based with AI explanation. |
| Hotspot Detection | Critical | Coordinates/statistics | 1 day | Use precomputed/simple clustering for demo. |
| Risk Score | Optional | Case features, rules | 0.5-1 day | Rule-based risk level. |
| Report Generation | Optional | Summarization | 0.5-1 day | Generate supervisor brief. |
| Voice Assistant | Optional | Chat + STT | 1 day | Browser speech or mocked transcript. |

## Phase 1 Deliverables

| Deliverable | Priority |
|---|---|
| Working case investigation demo | Critical |
| Legal recommendation with explanation | Critical |
| Similar FIR discovery | Critical |
| Graph visualization | Critical |
| Analytics dashboard | Critical |
| Hotspot map | Critical |
| AI chat with evidence panel | Critical |
| Supervisor-ready pitch flow | Critical |

## Phase 1 Do Not Build

These are tempting but should be avoided during MVP unless everything critical is done:

- Full police RMS replacement.
- Full court workflow.
- Full chargesheet automation.
- Real-time voice assistant.
- Deep user administration.
- Complex ML training pipelines.
- Full Neo4j-level graph backend.
- Mobile app.
- Multi-language full product.
- Every CRUD screen.

---

# Phase 2: Strong Prototype / Post-MVP

Goal: convert the MVP into a more complete investigation platform with stronger workflow and review capabilities.

## Phase 2 Feature Table

| Feature | Priority | Dependencies | Estimated Time | Notes |
|---|---|---|---:|---|
| Full FIR Registration Workflow | Critical | Cases API, validation, legal recommendation | 2 days | Guided FIR entry with AI warnings. |
| Case Assignment Workflow | Critical | Officer workload, tasks, roles | 1-2 days | SHO assigns IO with AI workload suggestion. |
| Alerts and Tasks | Critical | Recommendations, risk score, officer model | 1-2 days | Operationalizes AI output. |
| Supervisor Review Queue | Critical | Recommendations, validation, tasks | 1-2 days | Review accept/reject/escalate. |
| Chargesheet Readiness | Critical | Evidence, witnesses, legal sections, timeline | 2 days | Checklist and readiness score. |
| Evidence Management | Critical | Evidence, documents, forensic models | 2 days | Add/list evidence, documents, forensic status. |
| Victim Profile | Critical | Victim data, vulnerability rules | 1 day | Sensitive case flags and support actions. |
| Criminal Profile | Critical | Accused, repeat offender, graph links | 1-2 days | Profile view with history and risk. |
| Repeat Offender Detection | Critical | Accused links, graph, review | 2 days | Human-reviewed candidate matches. |
| Report Generation | Critical | Summaries, templates, export | 1-2 days | Supervisor brief, case summary. |
| RAG Retrieval Logs and Audit | Critical | Chat, legal, recommendations | 1 day | Explainability and governance. |
| Advanced IPC/Legal Knowledge Base | Critical | More acts and structured legal metadata | 2 days | BNS, BNSS, IT Act, NDPS, POCSO, MV Act. |
| Better Hotspot Detection | Optional | Clean geodata, clustering | 1-2 days | Replace demo hotspot with DBSCAN/HDBSCAN. |
| Officer Workload Dashboard | Optional | Tasks, cases, assignments | 1 day | Useful for supervisors. |
| Kannada voice query | Optional | STT, translation, chat | 2 days | Add once text chat is stable. |

## Phase 2 AI Modules

| AI Module | Priority | Dependencies | Estimated Time | Notes |
|---|---|---|---:|---|
| Evidence Gap Detection | Critical | Evidence model, legal sections | 1-2 days | Helps chargesheet readiness. |
| Chargesheet Readiness | Critical | Evidence gap, timeline, legal recommendation | 2 days | Strong police workflow. |
| Repeat Offender Detection | Critical | Graph, accused profiles | 2 days | Must include human review. |
| Victim Risk Analysis | Critical | Victim profile, case context | 1 day | Policy-sensitive. |
| Risk Score | Critical | Case features, hotspot, offender signals | 1 day | Explainable rule-based first. |
| Report Generation | Critical | Summarization, templates | 1 day | Supervisor and case reports. |
| AI Governance and Audit | Critical | Model outputs, review actions | 1 day | Builds trust. |

---

# Phase 3: Intelligence Platform Expansion

Goal: build advanced graph intelligence, analytics, and operational intelligence capabilities.

## Phase 3 Feature Table

| Feature | Priority | Dependencies | Estimated Time | Notes |
|---|---|---|---:|---|
| Advanced Network Analysis | Critical | Knowledge graph, node/edge confidence | 2-3 days | Shortest path, centrality, graph filters. |
| Gang Detection | Critical | Co-offending graph, repeat offender profile | 2-3 days | Must be review-only, not automatic accusation. |
| Financial Fraud / Money Trail | Critical | Financial accounts, transactions, graph | 2-3 days | Useful for cyber/UPI fraud demos. |
| Advanced Crime Forecasting | Critical | Historical statistics, feature engineering | 2-3 days | Forecast by district/unit/crime type. |
| Hotspot Patrol Planning | Critical | Hotspots, forecast, tasks | 2 days | Converts analytics into action. |
| Analytics Briefing Generator | Critical | Reports, charts, RAG, LLM | 1-2 days | Monthly crime review assistant. |
| Graph Algorithm Dashboard | Optional | Graph engine | 2 days | Community detection, centrality, components. |
| Cross-District Intelligence Sharing | Optional | Permissions, graph, data governance | 2 days | Requires strong access control. |
| Court Proceeding Tracking | Optional | Court records, chargesheet | 2 days | Trial/case outcome intelligence. |
| Forensic Workflow Integration | Optional | Forensic report model | 2 days | Lab request/status tracking. |

## Phase 3 AI Modules

| AI Module | Priority | Dependencies | Estimated Time | Notes |
|---|---|---|---:|---|
| Network Analysis | Critical | Graph data | 2 days | Visual + explainable. |
| Gang Detection | Critical | Network analysis, review workflow | 2-3 days | Use community detection. |
| Financial Fraud / Money Trail | Critical | Account/transaction graph | 2-3 days | Trace fund paths. |
| Crime Prediction | Critical | Analytics time series | 2 days | Evaluate against historical periods. |
| Advanced Hotspot Detection | Critical | Valid geodata | 2 days | Spatial clustering. |
| Graph Embedding Similarity | Optional | Vector store, graph data | 2-3 days | Improve case/person matching. |

---

# Phase 4: Deployable Police Operating System

Goal: prepare for realistic pilot-level deployment with governance, scale, security, multilingual use, integrations, and operational maturity.

## Phase 4 Feature Table

| Feature | Priority | Dependencies | Estimated Time | Notes |
|---|---|---|---:|---|
| Full Role-Based Access Control | Critical | Auth, audit, sensitivity model | 3+ days | Required for real police deployment. |
| Data Ingestion / ETL Admin Console | Critical | Data source registry, pipelines | 3+ days | CSV/PDF/API ingestion monitoring. |
| Complete Audit and Compliance Dashboard | Critical | Model audit, access logs, review logs | 2-3 days | Trust and governance. |
| Kannada + English Full UX | Critical | Translation, voice, legal terminology | 3+ days | Needed for field adoption. |
| Offline / Low-Bandwidth Mode | Critical | Cached data, sync design | 3+ days | Important for field conditions. |
| Mobile/Tablet Field Interface | Critical | Responsive UX, permissions | 3+ days | For evidence and scene updates. |
| External API Integrations | Optional | Legal/policy approval | 3+ days | CCTNS, court, forensic lab, bank/cyber APIs. |
| Advanced Voice Assistant | Optional | STT, translation, chat, review | 3+ days | Voice FIR notes and assistant queries. |
| Evidence Media AI | Optional | Image/video/audio processing | 3+ days | OCR, image tagging, CCTV metadata. |
| Predictive Patrol Optimization | Optional | Hotspot, resource availability | 3+ days | Advanced operations module. |
| Model Monitoring and Drift Detection | Critical | AI governance | 2-3 days | Production AI safety. |
| Privacy / Redaction Engine | Critical | Documents, reports, roles | 2-3 days | Redact sensitive victim/person data. |

## Phase 4 AI Modules

| AI Module | Priority | Dependencies | Estimated Time | Notes |
|---|---|---|---:|---|
| Voice Assistant | Critical | Kannada/English STT, chat | 3+ days | Production-quality multilingual support. |
| AI Governance and Audit | Critical | All AI outputs | 2-3 days | Model monitoring and compliance. |
| Advanced Report Generation | Critical | Redaction, templates, exports | 2-3 days | Court/supervisor/command formats. |
| Evidence Media Intelligence | Optional | OCR/image/video processing | 3+ days | Future high-value feature. |
| Predictive Patrol Optimization | Optional | Forecast + hotspots + resources | 3+ days | Advanced operations. |

---

# MVP Dependency Chain

The MVP must be built in this order:

```text
1. Database schema + seed/import sample data
        ↓
2. Case list and case detail
        ↓
3. Legal search and IPC knowledge base
        ↓
4. RAG retrieval and AI reasoning prompt
        ↓
5. Legal recommendation + FIR validation
        ↓
6. Similar case discovery
        ↓
7. Graph view
        ↓
8. Analytics dashboard + hotspot map
        ↓
9. AI chat with evidence panel
        ↓
10. Demo polish and supervisor storyline
```

## MVP Hard Dependencies

| Feature | Depends On |
|---|---|
| Case Detail | Case data, victims, accused, legal sections. |
| Legal Recommendation | IPC/legal data, FIR narrative, RAG retrieval. |
| AI Chat | Reasoning engine, case context, retrieval, output template. |
| Similar Cases | Case features, embeddings or similarity rules. |
| Graph View | Case-person-location-section relationships. |
| Analytics | Crime review aggregate data. |
| Hotspot Map | Coordinates or precomputed hotspot data. |
| Supervisor Review | Recommendations, risk/alerts/tasks. |

---

# Hackathon Cut Line

If time is short, keep only these:

| Keep | Why |
|---|---|
| Case Detail | Central investigation workspace. |
| AI Chat with Evidence Panel | Flagship differentiator. |
| Legal Recommendation | Shows legal intelligence. |
| Similar Cases | Shows investigative intelligence. |
| Basic Graph | Shows police intelligence OS, not chatbot. |
| Analytics Dashboard | Satisfies crime analytics requirement. |
| Hotspot Map | Strong visual demo. |

Cut these first:

| Cut First | Reason |
|---|---|
| Voice Assistant | Risky and not necessary for MVP. |
| Full Chargesheet Workflow | Complex; show readiness card instead. |
| Full CRUD Admin | Not demo-critical. |
| Advanced Forecasting | Simple trend forecast is enough. |
| Gang Detection | Can be represented by graph cluster demo. |
| Financial Trail | Add only if cyber fraud demo is central. |
| Mobile App | Not needed. |

---

# Recommended Demo Story

## Story: Night Burglary Case

1. Dashboard shows high-risk burglary FIR and emerging hotspot.
2. Officer opens the case.
3. Case detail shows FIR, victim, location, sections, timeline.
4. AI validates FIR and says:
   - property value missing
   - witness statement missing
   - threat detail may require legal review
5. Officer asks AI:
   - “What sections apply?”
6. AI suggests sections with supporting FIR words and confidence.
7. Officer asks:
   - “Find similar cases.”
8. AI shows 3 similar FIRs and why they match.
9. Officer opens graph.
10. Graph shows shared vehicle/phone/location link.
11. Crime map shows hotspot around same beat.
12. AI recommends night patrol and checking CCTV.
13. Supervisor review queue shows recommendation awaiting approval.

This demo proves:

- FIR intelligence
- Legal reasoning
- Similarity search
- Knowledge graph
- Hotspot analytics
- AI recommendations
- Human review

---

# Final Recommendation

For the hackathon, focus on **Phase 1 only** and make it polished. A focused investigation OS demo will beat a large unfinished platform.

Build depth in these five moments:

1. Case detail feels like a real investigation file.
2. AI legal recommendation feels trustworthy.
3. Similar case discovery feels like detective intelligence.
4. Graph view shows hidden links.
5. Chat answer includes evidence, confidence, and next action.

Everything else can be roadmap.
