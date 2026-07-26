# Core Infrastructure

Shared backend infrastructure lives here. Domain modules must import shared behavior from `core` instead of duplicating code.

Folders:

- `exceptions/` application errors and error types
- `logger/` application logger
- `cache/` Redis/cache clients and abstractions
- `auth/` shared role, permission, auth context types
- `pagination/` pagination helpers
- `database/` Prisma/database clients and database abstractions
- `response/` API response envelope and async handler
- `validation/` shared validation middleware/helpers
- `constants/` app-wide constants
- `interfaces/` shared interfaces/contracts
