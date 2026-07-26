# KSP Intelligence OS Backend

Production-ready backend scaffold for the AI Crime Intelligence Platform.

## Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Redis
- JWT-ready architecture
- Gemini/OpenAI-ready AI abstraction plan
- Clean Architecture
- Repository Pattern
- Service Layer
- Controller Layer

## Phase 1 Scope

This scaffold includes foundation only:

- Express application shell
- Environment configuration
- Shared `src/core` infrastructure
- Logging
- Error handling
- Request ID middleware
- Rate limiting
- Security middleware
- Prisma scaffold
- Redis client scaffold
- Docker and docker-compose
- Health routes
- Standardized module folder architecture

No business logic has been implemented yet.

## Shared Core Infrastructure

Shared infrastructure lives under `src/core`:

```text
core/
├── exceptions/
├── logger/
├── cache/
├── auth/
├── pagination/
├── database/
├── response/
├── validation/
├── constants/
└── interfaces/
```

## Standard Module Structure

Every module uses the same structure:

```text
module-name/
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

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run prisma:validate
```

## Health Check

```text
GET /health
GET /api/v1/health
```

## Engineering Milestones

1. Backend Foundation
2. Core Police System
3. Intelligence Engine
4. Operational Intelligence
5. Demo Readiness

## Next Step

Proceed to Milestone 1 / Phase 2: Authentication and Authorization.
