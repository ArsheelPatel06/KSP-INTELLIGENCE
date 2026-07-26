# Backend Implementation Plan

Purpose: define the backend build plan for KSP Intelligence OS before generating code. This plan keeps development modular, testable, and aligned with the database, API, AI, graph, and product design documents.

References:

- `../docs/api/api_contract.md`
- `../docs/product/feature_priority.md`
- `../docs/product/investigation_workflows.md`
- `../docs/ai/ai_reasoning_engine.md`
- `../docs/ai/ai_modules.md`
- `../docs/database/master_schema.md`
- `../docs/database/knowledge_graph.md`
- `../schema.sql`

## Backend Goal

Build a production-ready Node.js backend for an AI-powered Crime Intelligence and Investigation Platform. The backend should support the hackathon MVP first, while remaining scalable enough for later Zoho Catalyst deployment.

## Technology Stack

| Layer                 | Choice                                                                     |
| --------------------- | -------------------------------------------------------------------------- |
| Runtime               | Node.js                                                                    |
| Language              | TypeScript                                                                 |
| HTTP Framework        | Express                                                                    |
| Database              | PostgreSQL locally; Zoho Catalyst DataStore later                          |
| ORM                   | Prisma                                                                     |
| Cache / Queue Support | Redis                                                                      |
| Authentication        | JWT access token + refresh token                                           |
| Validation            | Zod or Joi                                                                 |
| Logging               | Pino or Winston                                                            |
| Security              | Helmet, CORS, rate limiting, request validation                            |
| Password Hashing      | bcrypt or argon2                                                           |
| AI Providers          | Gemini/OpenAI-ready abstraction                                            |
| Architecture          | Clean Architecture + Repository Pattern + Service Layer + Controller Layer |
| Deployment            | Docker locally; Catalyst AppSail/Functions later                           |

## Final Backend Folder Architecture

```text
backend/
├── src/
│   ├── app/
│   ├── config/
│   ├── core/
│   │   ├── exceptions/
│   │   ├── logger/
│   │   ├── cache/
│   │   ├── auth/
│   │   ├── pagination/
│   │   ├── database/
│   │   ├── response/
│   │   ├── validation/
│   │   ├── constants/
│   │   └── interfaces/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── cases/
│   │   ├── fir/
│   │   ├── accused/
│   │   ├── victims/
│   │   ├── complainants/
│   │   ├── officers/
│   │   ├── legal/
│   │   ├── analytics/
│   │   ├── hotspot/
│   │   ├── recommendations/
│   │   ├── reports/
│   │   ├── dashboard/
│   │   ├── graph/
│   │   ├── chat/
│   │   ├── voice/
│   │   └── notifications/
│   ├── ai/
│   │   ├── rag/
│   │   ├── embeddings/
│   │   ├── agents/
│   │   ├── prompts/
│   │   ├── models/
│   │   ├── pipelines/
│   │   ├── reasoning/
│   │   ├── memory/
│   │   └── tools/
│   ├── middleware/
│   ├── jobs/
│   ├── sockets/
│   ├── tests/
│   └── scripts/
├── prisma/
├── docker/
├── package.json
├── tsconfig.json
├── .env.example
├── Dockerfile
└── docker-compose.yml
```

## Standard Module Structure

Every domain module must use the same folder structure. Consistency is mandatory.

```text
cases/
├── controllers/
├── services/
├── repositories/
├── routes/
├── dto/
├── validators/
├── interfaces/
├── types/
├── mappers/
├── utils/
└── tests/
```

This same structure applies to `auth`, `users`, `fir`, `accused`, `victims`, `complainants`, `officers`, `legal`, `analytics`, `hotspot`, `recommendations`, `reports`, `dashboard`, `graph`, `chat`, `voice`, and `notifications`.

## Shared Core Infrastructure

Shared infrastructure must live in `src/core`, not inside feature modules.

| Core Folder       | Responsibility                                       |
| ----------------- | ---------------------------------------------------- |
| `core/exceptions` | Application errors and exception classes.            |
| `core/logger`     | Application logger and logging abstractions.         |
| `core/cache`      | Redis/cache client and cache abstractions.           |
| `core/auth`       | Shared roles, permissions, auth context interfaces.  |
| `core/pagination` | Pagination helpers and pagination metadata.          |
| `core/database`   | Prisma/database client and database abstractions.    |
| `core/response`   | API response envelope and async handler utilities.   |
| `core/validation` | Shared validation middleware and validation helpers. |
| `core/constants`  | Application-wide constants.                          |
| `core/interfaces` | Shared repository/service/request interfaces.        |

## Architecture Rules

1. Controllers must not access Prisma directly.
2. Services contain business logic.
3. Repositories contain database access.
4. Routes only connect endpoints to controllers and middleware.
5. Module-specific validators must live in `modules/<module>/validators`.
6. Shared validation helpers must live in `core/validation`.
7. Shared logger, response, pagination, auth, database, cache, and exceptions must live in `core`.
8. AI modules must not directly mutate operational records without service/review layer.
9. Every AI-generated recommendation must support evidence, confidence, model version, and review status.
10. All sensitive access and write operations should be auditable.
11. Zoho Catalyst compatibility should be preserved by keeping database access behind repositories.
12. Phase 1 must not overbuild enterprise features that are not needed for the demo.

## Core Backend Request Flow

```text
HTTP Request
    ↓
Express Route
    ↓
Auth Middleware
    ↓
Permission Middleware
    ↓
Validation Middleware
    ↓
Controller
    ↓
Service
    ↓
Repository / AI Pipeline / External Provider
    ↓
Response Formatter
    ↓
HTTP Response
```

## AI Request Flow

```text
User Question
    ↓
Chat Controller
    ↓
Chat Service
    ↓
AI Reasoning Pipeline
    ↓
Intent Detection
    ↓
Entity Extraction
    ↓
Permission Check
    ↓
Database Search
    ↓
Graph Search
    ↓
Legal Search
    ↓
Analytics Search
    ↓
Evidence Collection
    ↓
LLM / Recommendation Logic
    ↓
Confidence + Explainability
    ↓
Audit Log
    ↓
JSON Response
```

---

# Engineering Milestones

The detailed phase list below is useful for implementation planning, but hackathon execution should be milestone-based. After each milestone, the system should be demonstrable.

## Milestone 1: Backend Foundation

Scope:

- Project scaffold
- Shared `core` infrastructure
- Authentication
- Prisma schema
- Repositories

Outcome:

- Backend starts reliably.
- Authentication and RBAC are available.
- Database schema is represented in Prisma.
- Repository layer is ready for core modules.

## Milestone 2: Core Police System

Scope:

- Cases
- FIR
- Victims
- Accused
- Complainants
- Officers
- Legal search

Outcome:

- Users can browse and inspect case records.
- FIR validation can run against structured case data.
- Legal search can retrieve acts/sections.

## Milestone 3: Intelligence Engine

Scope:

- AI agents
- RAG
- Knowledge graph
- Recommendations
- Similar case detection

Outcome:

- AI chat can answer with evidence.
- Legal recommendations work with confidence and review status.
- Similar cases and graph links are visible.

## Milestone 4: Operational Intelligence

Scope:

- Analytics
- Dashboard
- Reports
- Hotspots
- Notifications

Outcome:

- Supervisors can see attention items.
- Crime trends and hotspot views are available.
- Recommendations become tasks/alerts/reports.

## Milestone 5: Demo Readiness

Scope:

- Voice
- PDF export
- Scheduler
- Zoho Catalyst deployment path
- Testing
- Seed/demo data

Outcome:

- Demo flow is stable.
- Offline/mock AI path is available.
- Export and deployment story is credible.

# Detailed Build Order

## Phase 1: Project Foundation

### Goal

Create the backend scaffold only. No business logic.

### Deliverables

- `package.json`
- `tsconfig.json`
- ESLint config
- Prettier config
- `.env.example`
- `Dockerfile`
- `docker-compose.yml`
- Express app initialization
- Config loader
- Shared `src/core` infrastructure
- Core logger
- Core exception handling
- Core response envelope helper
- Core validation helper
- Core pagination helper
- Core database and cache clients
- Error handler
- Rate limiter
- CORS/Helmet setup
- Prisma folder initialized
- Redis client wrapper placeholder
- Health check route

### Modules Affected

- `src/app`
- `src/config`
- `src/core`
- `src/middleware`
- compatibility re-exports in `src/database` and `src/utils`

### Dependencies

None.

### APIs Exposed

| Endpoint         | Method | Purpose                 |
| ---------------- | ------ | ----------------------- |
| `/health`        | `GET`  | Backend health check.   |
| `/api/v1/health` | `GET`  | Versioned health check. |

### Complexity

Medium.

### Acceptance Criteria

- Backend starts locally with `npm run dev`.
- TypeScript compiles.
- Docker container builds.
- Health endpoint returns standard response envelope.
- Invalid routes return structured error.
- Environment config loads safely.
- Logger works.
- No business modules implemented yet.

---

## Phase 2: Authentication and Authorization

### Goal

Implement secure authentication, roles, permissions, JWT, refresh tokens, password hashing, and audit logs.

### Roles

- Super Admin
- DGP
- IG
- SP
- DSP
- Inspector
- SI
- Constable
- Crime Analyst
- Policy Maker

### Deliverables

- Auth module structure.
- User module structure.
- Login.
- Refresh token.
- Logout.
- Current user profile.
- Role and permission definitions.
- JWT middleware.
- Permission middleware.
- Password hashing.
- Auth audit logging.

### Modules Affected

- `modules/auth`
- `modules/users`
- `middleware/auth.middleware.ts`
- `middleware/permission.middleware.ts`
- `utils/password.ts`
- `utils/jwt.ts`

### Dependencies

- Phase 1 foundation.
- Initial Prisma user/auth models or temporary in-memory mock if Prisma is not ready.

### APIs Exposed

| Endpoint               | Method | Purpose               |
| ---------------------- | ------ | --------------------- |
| `/api/v1/auth/login`   | `POST` | User login.           |
| `/api/v1/auth/refresh` | `POST` | Refresh access token. |
| `/api/v1/auth/logout`  | `POST` | Logout.               |
| `/api/v1/auth/me`      | `GET`  | Current user profile. |

### Complexity

Medium.

### Acceptance Criteria

- Passwords are hashed, not stored raw.
- Login returns access and refresh tokens.
- Protected endpoint rejects missing/invalid token.
- Role middleware blocks unauthorized access.
- Auth events are logged.
- Token expiry and refresh behavior work.

---

## Phase 3: Database and Prisma Schema

### Goal

Generate `schema.prisma` from `master_schema.md` and `schema.sql`. Do not generate APIs in this phase.

### Deliverables

- Prisma schema models for official core tables.
- Prisma schema models for AI extension tables.
- Relations matching foreign keys.
- Indexes where Prisma supports them.
- Seed script placeholder.
- Migration plan.

### Modules Affected

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/database/prisma.client.ts`

### Dependencies

- `schema.sql`
- `docs/database/master_schema.md`

### APIs Exposed

None.

### Complexity

High.

### Acceptance Criteria

- `npx prisma validate` passes.
- Prisma client generates successfully.
- Core models exist: CaseMaster, Victim, Accused, Employee, Unit, District, Act, Section.
- AI models exist: Recommendation, RiskScore, Hotspot, CaseSimilarity, ChatSession, ModelAuditLog, RAG models, KG models.
- Relations are represented.
- Naming remains clear and maintainable.

---

## Phase 4: Database Access Repositories

### Goal

Create repository classes only. No business logic.

### Deliverables

- `CaseRepository`
- `VictimRepository`
- `AccusedRepository`
- `OfficerRepository`
- `ActRepository`
- `LegalRepository`
- `GraphRepository`
- `AnalyticsRepository`
- `HotspotRepository`
- `RecommendationRepository`
- `ChatRepository`
- `ReportRepository`
- `AuditRepository`

### Modules Affected

- `modules/cases/repositories`
- `modules/victims/repositories`
- `modules/accused/repositories`
- `modules/officers/repositories`
- `modules/legal/repositories`
- `modules/analytics/repositories`
- `modules/graph/repositories`
- `modules/recommendations/repositories`
- `modules/chat/repositories`

### Dependencies

- Phase 3 Prisma schema.

### APIs Exposed

None.

### Complexity

Medium.

### Acceptance Criteria

- Repositories compile.
- Repositories use Prisma client only.
- No Express request/response imports inside repositories.
- Common pagination and filtering patterns exist.
- Unit-testable methods exist for core read paths.

---

## Phase 5: Business Services

### Goal

Implement service-layer business logic for core backend modules.

### Deliverables

- `CaseService`
- `FIRService`
- `VictimService`
- `AccusedService`
- `OfficerService`
- `AnalyticsService`
- `LegalService`
- `GraphService`
- `DashboardService`
- `RecommendationService`
- `ReportService`

### Modules Affected

- All core `modules/*/services`

### Dependencies

- Phase 4 repositories.
- Auth/permission context.

### APIs Exposed

None directly.

### Complexity

High.

### Acceptance Criteria

- Services use repositories, not Prisma directly.
- Services enforce jurisdiction and role constraints where applicable.
- Services return DTOs suitable for controllers.
- Services are testable without HTTP context.
- No AI provider calls yet unless explicitly part of service design.

---

## Phase 6: Controllers

### Goal

Create controller classes that map HTTP requests to services.

### Deliverables

- `CaseController`
- `VictimController`
- `AccusedController`
- `OfficerController`
- `AnalyticsController`
- `DashboardController`
- `LegalController`
- `GraphController`
- `RecommendationController`
- `ChatController`
- `ReportController`

### Dependencies

- Phase 5 services.
- Validation middleware.
- Response envelope helper.

### APIs Exposed

Controllers implement API contract but routes are mounted in Phase 7.

### Complexity

Medium.

### Acceptance Criteria

- Controllers contain minimal logic.
- Controllers call services and return response envelope.
- Errors are delegated to error middleware.
- Request validation is not duplicated inside controller.

---

## Phase 7: Routes

### Goal

Wire controllers to versioned REST endpoints.

### Route Groups

- `/api/v1/auth`
- `/api/v1/cases`
- `/api/v1/victims`
- `/api/v1/accused`
- `/api/v1/officers`
- `/api/v1/legal`
- `/api/v1/ipc`
- `/api/v1/analytics`
- `/api/v1/dashboard`
- `/api/v1/hotspots`
- `/api/v1/recommendations`
- `/api/v1/graph`
- `/api/v1/chat`
- `/api/v1/reports`
- `/api/v1/export`
- `/api/v1/voice`

### Dependencies

- Phase 6 controllers.
- Auth middleware.
- Permission middleware.
- Validation schemas.

### Complexity

Medium.

### Acceptance Criteria

- All MVP routes are mounted.
- Swagger/OpenAPI placeholder or generated docs route exists if feasible.
- Protected routes require auth.
- Role-restricted routes enforce permissions.
- Unknown API routes return structured 404.

---

# AI Implementation Phases

## Phase 8: AI Folder and Agent Architecture

### Goal

Create AI module architecture without building every model.

### Agents

| Agent               | Responsibility                                               |
| ------------------- | ------------------------------------------------------------ |
| Investigation Agent | Case summary, FIR validation, next steps.                    |
| Legal Agent         | Acts, IPC, legal section recommendations.                    |
| Analytics Agent     | Trends, forecasts, hotspots, station performance.            |
| Graph Agent         | Relationship search, shortest path, network expansion.       |
| Report Agent        | Case summaries, supervisor briefs, exports.                  |
| Supervisor Agent    | Attention dashboard, review queue, priority recommendations. |

### Deliverables

- `ai/agents`
- `ai/reasoning`
- `ai/prompts`
- `ai/tools`
- `ai/models`
- Provider abstraction for Gemini/OpenAI.
- Base agent interface.
- Prompt templates.

### Dependencies

- Phase 5 services for retrieval.

### Complexity

High.

### Acceptance Criteria

- Agents are separate classes/modules.
- No single monolithic chatbot.
- Provider abstraction can switch Gemini/OpenAI.
- Agents return structured JSON.
- AI responses include confidence and evidence placeholders.

---

## Phase 9: RAG Architecture

### Goal

Implement retrieval-augmented generation components.

### Components

- Retriever
- Chunker
- Embeddings service
- Vector store adapter
- Prompt builder
- Citation engine
- Retrieval log writer

### Dependencies

- RAG database models.
- Legal/case/report documents.
- AI provider abstraction.

### APIs Supported

- Legal search.
- Chat evidence retrieval.
- Report generation.
- Case summarization.

### Complexity

High.

### Acceptance Criteria

- Can retrieve relevant legal/case/report chunks.
- Retrieval result includes source references.
- Prompt builder injects evidence safely.
- Citation engine returns source list.
- Retrieval logs are persisted.

---

## Phase 10: Knowledge Graph Services

### Goal

Implement graph query services over relational graph projection tables.

### Capabilities

- Neighbor search.
- Case graph.
- Shortest path.
- K-hop expansion.
- Connected components approximation.
- Centrality approximation for MVP.
- Community detection placeholder for later.

### Dependencies

- `kg_node`, `kg_edge` data.
- GraphRepository.

### APIs Supported

- `/api/v1/graph/cases/:caseMasterId`
- `/api/v1/graph/nodes/:nodeId/expand`
- `/api/v1/graph/path`
- `/api/v1/graph/network-analysis`

### Complexity

High.

### Acceptance Criteria

- Case graph returns nodes and edges.
- Node expansion works with confidence filters.
- Shortest path works for reasonable depth.
- Inferred edges are clearly marked.
- Graph response is frontend visualization-ready.

---

## Phase 11: Analytics Services

### Goal

Implement analytics capabilities separately.

### Services

- CrimeTrendService
- CrimeForecastService
- HotspotAnalyticsService
- VictimAnalyticsService
- StationPerformanceService
- OfficerPerformanceService
- RepeatCrimeService

### Dependencies

- Crime statistics.
- Case aggregates.
- Hotspot data.
- Officer/case/task data.

### APIs Supported

- `/api/v1/analytics/crime-trends`
- `/api/v1/analytics/district-comparison`
- `/api/v1/analytics/forecast`
- `/api/v1/analytics/attention-summary`

### Complexity

Medium to High.

### Acceptance Criteria

- Trend APIs return chart-ready data.
- Comparison APIs return rank-ready data.
- Forecast can start with baseline/statistical forecast.
- Attention summary powers dashboard cards.

---

## Phase 12: Legal Engine

### Goal

Implement legal search and section recommendation.

### Capabilities

- Acts search.
- IPC search.
- Section detail.
- Punishment lookup.
- Section explanation.
- FIR text to candidate sections.
- Similar judgments placeholder for future.

### Dependencies

- Act/Section tables.
- IPC reference.
- Legal RAG.
- Legal Agent.

### APIs Supported

- `/api/v1/acts`
- `/api/v1/acts/:actCode`
- `/api/v1/acts/:actCode/sections`
- `/api/v1/ipc/search`
- `/api/v1/ipc/:sectionCode`
- `/api/v1/ipc/recommend`

### Complexity

High.

### Acceptance Criteria

- Legal search returns relevant sections.
- Legal recommendation includes reason, supporting facts, missing facts, confidence.
- No hallucinated legal sections.
- Legal recommendations are marked review-required.

---

## Phase 13: Chat and Conversation

### Goal

Implement investigation chat backed by reasoning pipeline, not direct LLM answers.

### Capabilities

- Conversation sessions.
- Message history.
- Intent detection.
- Entity extraction.
- Tool routing.
- Evidence panel.
- Memory scoped to case/session.
- Optional PDF export.
- Voice integration placeholder.
- Translation placeholder.

### Dependencies

- AI agents.
- RAG.
- Case service.
- Legal service.
- Graph service.
- Analytics service.

### APIs Supported

- `/api/v1/chat/sessions`
- `/api/v1/chat/sessions/:chatSessionId/messages`
- `/api/v1/chat/sessions/:chatSessionId`

### Complexity

High.

### Acceptance Criteria

- Chat answer follows standard output format.
- Chat stores history.
- Chat cites evidence.
- Chat can answer at least legal, similar case, case summary, graph question.
- Chat logs model audit entry.

---

## Phase 14: Dashboard

### Goal

Create backend endpoints for the main dashboard.

### Capabilities

- Summary cards.
- Recent FIR.
- Critical alerts.
- High-risk cases.
- Crime trends.
- Officer performance.
- Hotspots.
- Pending reviews.

### Dependencies

- Case service.
- Analytics service.
- Alert/recommendation/task data.

### APIs Supported

- `/api/v1/dashboard/summary`
- `/api/v1/dashboard/recent-cases`
- `/api/v1/dashboard/hotspots`
- `/api/v1/dashboard/alerts`
- `/api/v1/dashboard/officer-performance`

### Complexity

Medium.

### Acceptance Criteria

- Dashboard loads with one or few API calls.
- Data respects role/jurisdiction.
- Cards support Phase 1 demo story.

---

## Phase 15: Reports and Export

### Goal

Generate case summaries, station reports, crime reports, PDF, and Excel/CSV exports.

### Capabilities

- Case summary report.
- Supervisor brief.
- Crime report.
- Station report.
- PDF export.
- Excel/CSV export.

### Dependencies

- Report Agent.
- Case service.
- Analytics service.
- Export job infrastructure.

### APIs Supported

- `/api/v1/reports/crime-review`
- `/api/v1/reports/crime-review/:reportId`
- `/api/v1/reports/cases/:caseMasterId/generate`
- `/api/v1/export/cases/:caseMasterId`
- `/api/v1/export/analytics`
- `/api/v1/export/jobs/:exportJobId`

### Complexity

Medium to High.

### Acceptance Criteria

- Can generate supervisor brief.
- Export job status works.
- PDF/CSV generation can be mocked in MVP if necessary.
- Reports respect redaction and role permissions.

---

## Phase 16: Notifications

### Goal

Notify officers and supervisors about alerts, tasks, AI recommendations, and reviews.

### Channels

- In-app alerts.
- Email.
- Push notification placeholder.

### Dependencies

- Alerts.
- Tasks.
- Recommendations.
- User preferences.

### APIs Supported

- `/api/v1/notifications`
- `/api/v1/notifications/:id/read`
- `/api/v1/notifications/preferences`

### Complexity

Medium.

### Acceptance Criteria

- In-app notifications work.
- Recommendation/task alerts create notifications.
- Read/unread status works.

---

## Phase 17: Scheduler and Jobs

### Goal

Run background tasks for analytics, embeddings, forecasts, and hotspot updates.

### Jobs

- Nightly analytics aggregation.
- Embedding updates.
- Crime forecast update.
- Hotspot update.
- Data quality scan.
- Expired export cleanup.
- Notification digest.

### Dependencies

- Redis/queue or scheduled process.
- Database models.
- AI/RAG modules.

### Complexity

Medium.

### Acceptance Criteria

- Jobs can be run manually from scripts.
- Job logs are stored.
- Failed jobs are captured and reported.
- MVP can run jobs manually if scheduler is not ready.

---

## Phase 18: Testing, Seed Data, and Quality

### Goal

Create confidence before demo and deployment.

### Deliverables

- Unit tests.
- Integration tests.
- Auth tests.
- Service tests.
- Repository tests.
- Mock AI provider.
- Seed data.
- Demo dataset.
- API test collection.

### Dependencies

- All previous phases.

### Complexity

Medium.

### Acceptance Criteria

- Core MVP APIs pass tests.
- Seed data can create demo scenario.
- Mock AI allows offline demo.
- Error cases tested for auth, permission, validation.

---

# Module Dependency Matrix

| Module          | Depends On                         | Used By                                    |
| --------------- | ---------------------------------- | ------------------------------------------ |
| Auth            | Foundation, User                   | All protected APIs                         |
| Users           | Auth, Prisma                       | Auth, Officers, Audit                      |
| Cases           | Prisma, Auth                       | FIR, Chat, Graph, Legal, Dashboard         |
| FIR             | Cases, Legal                       | FIR Validation, Registration               |
| Victims         | Cases                              | Case Detail, Victim Analysis               |
| Accused         | Cases                              | Repeat Offender, Graph, Criminal Profile   |
| Complainants    | Cases                              | FIR, Case Detail                           |
| Officers        | Users, Units                       | Assignment, Dashboard, Workload            |
| Legal           | Acts, Sections, RAG                | Legal Recommendation, Chat, FIR Validation |
| Analytics       | Crime Statistics, Cases            | Dashboard, Forecast, Reports               |
| Hotspot         | Cases, Geo, Analytics              | Dashboard, Map, Recommendations            |
| Recommendations | AI, Cases, Hotspots                | Review Queue, Tasks, Chat                  |
| Reports         | Cases, Analytics, AI               | Export, Supervisor Brief                   |
| Dashboard       | Cases, Analytics, Hotspots, Alerts | Frontend Home                              |
| Graph           | KG Nodes/Edges, Cases              | Chat, Network View, Similarity             |
| Chat            | AI, RAG, Cases, Legal, Graph       | AI Investigation Interface                 |
| Voice           | Chat, AI Provider                  | Voice Assistant                            |
| Notifications   | Tasks, Alerts, Recommendations     | Officers/Supervisors                       |
| RAG             | Documents, Embeddings              | Legal, Chat, Reports                       |
| Embeddings      | RAG, AI Provider                   | Similarity, Retrieval                      |
| Agents          | AI Provider, Services              | Chat, Recommendations, Reports             |
| Jobs            | Analytics, RAG, Hotspots           | Scheduled Updates                          |

---

# MVP Backend Scope

For hackathon Phase 1, implement only the backend needed for:

| MVP Capability       | Backend Modules Needed                   |
| -------------------- | ---------------------------------------- |
| Login / current user | Auth, Users                              |
| Case list/detail     | Cases, Victims, Accused, Legal           |
| Case timeline        | Cases, FIR/Diary, Evidence minimal       |
| FIR validation       | FIR, Legal, AI Investigation Agent       |
| Legal recommendation | Legal, RAG, Legal Agent, Recommendations |
| AI chat              | Chat, AI Reasoning, RAG, Cases, Legal    |
| Similar cases        | Cases, Embeddings or similarity service  |
| Graph view           | Graph, Cases                             |
| Analytics dashboard  | Analytics, Dashboard                     |
| Hotspot map          | Hotspot, Analytics                       |
| Recommendation cards | Recommendations, Dashboard               |

## MVP APIs to Implement First

1. `POST /api/v1/auth/login`
2. `GET /api/v1/auth/me`
3. `GET /api/v1/cases`
4. `GET /api/v1/cases/:caseMasterId`
5. `GET /api/v1/cases/:caseMasterId/timeline`
6. `POST /api/v1/cases/:caseMasterId/validate`
7. `GET /api/v1/cases/:caseMasterId/similar`
8. `GET /api/v1/ipc/search`
9. `POST /api/v1/ipc/recommend`
10. `GET /api/v1/analytics/crime-trends`
11. `GET /api/v1/analytics/attention-summary`
12. `GET /api/v1/hotspots`
13. `GET /api/v1/graph/cases/:caseMasterId`
14. `POST /api/v1/chat/sessions`
15. `POST /api/v1/chat/sessions/:chatSessionId/messages`
16. `GET /api/v1/recommendations`
17. `POST /api/v1/recommendations/:recommendationId/review`

---

# Complexity Summary

| Area                    | Complexity | Reason                                             |
| ----------------------- | ---------- | -------------------------------------------------- |
| Project foundation      | Medium     | Config, tooling, Docker, error handling.           |
| Auth/RBAC               | Medium     | Roles and permissions must be clean.               |
| Prisma schema           | High       | Large schema and many relationships.               |
| Core CRUD services      | Medium     | Straightforward but many entities.                 |
| Legal engine            | High       | RAG + legal correctness + review.                  |
| Chat/reasoning          | High       | Multi-agent orchestration and hallucination guard. |
| Graph service           | High       | Graph traversal over relational tables.            |
| Analytics               | Medium     | Aggregates and chart-ready APIs.                   |
| Reports/export          | Medium     | Templates and file generation.                     |
| Voice                   | High       | Speech/translation reliability.                    |
| Zoho Catalyst migration | High       | Requires adapter layer and deployment changes.     |

---

# Zoho Catalyst Strategy

Do not start with Catalyst-specific implementation.

## Local Development

```text
Express
  ↓
Prisma
  ↓
PostgreSQL
```

## Deployment Adaptation Later

```text
Express/AppSail or Catalyst Functions
  ↓
Repository Adapter
  ↓
Catalyst DataStore or PostgreSQL-compatible service
```

## Rules for Catalyst Compatibility

- Keep database logic inside repositories.
- Avoid raw SQL in services.
- Avoid PostgreSQL-only features in critical business logic.
- Use provider interfaces for file storage, jobs, and AI providers.
- Keep environment configuration external.
- Keep export/voice/AI integrations behind service adapters.

---

# Acceptance Criteria for Backend Milestones

## Milestone 1: Foundation

- Backend scaffold exists.
- Auth works.
- Prisma schema validates.
- Docker works.
- Logging and error handling work.

## Milestone 2: Core Police APIs

- Case list/detail works.
- Victim/accused/officer basic retrieval works.
- Legal search works.
- RBAC and audit logs exist.

## Milestone 3: AI Services

- RAG retrieval works.
- Legal recommendation works.
- Chat reasoning pipeline works.
- Graph case view works.
- Similar cases work.

## Milestone 4: Analytics and Reports

- Crime trends work.
- Hotspots work.
- Dashboard summary works.
- Report generation/export works.

## Milestone 5: Advanced Features

- Voice works.
- Notifications work.
- Scheduler jobs work.
- Zoho Catalyst deployment path is tested.

---

# Next Step

Start with **Phase 1: Project Foundation** only.

The next code-generation task should be:

```text
Create a production-ready backend architecture for KSP Intelligence OS.
Stack: Node.js, TypeScript, Express, PostgreSQL, Prisma, Redis, JWT, Gemini/OpenAI-ready.
Use Clean Architecture, Repository Pattern, Service Layer, Controller Layer, Validation Layer, Logging, Error Handling, Rate Limiting, Environment Config, Docker Ready.
Return folder structure and foundational files only. No business logic.
```
