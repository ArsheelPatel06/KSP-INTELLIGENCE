# Backend Modules

Every domain module must follow exactly the same structure:

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

Rules:

- Controllers handle HTTP input/output only.
- Services contain business logic.
- Repositories contain database access.
- Validators contain module-specific request validation schemas.
- DTOs define request/response data transfer shapes.
- Interfaces define module contracts.
- Mappers convert entities/models into API DTOs.
- Utils contain only module-local helpers.
- Tests live with the module.
- Shared utilities must go in `src/core`, not in module folders.

Phase 1 creates module folders only. Business logic will be added phase-by-phase.
