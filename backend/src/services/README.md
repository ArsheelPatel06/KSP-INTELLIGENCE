# Shared Services

Cross-cutting services live here only when they are not owned by a specific domain module.

Examples:

- Storage provider abstraction
- Email provider abstraction
- External AI provider abstraction
- Audit service shared interfaces

Domain business logic should stay inside `src/modules/<module>/services`.
