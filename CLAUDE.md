# FinSync AI — Engineering Standards

Production-ready multi-tenant SaaS for family finance management. Never generate prototype/quick code — everything modular, configurable, production-grade.

## Domain Model
- Every registered user creates a **Family Workspace** (the tenant).
- A workspace contains multiple **members** with roles (RBAC).
- **All APIs must be tenant-safe**: every query is scoped by `workspaceId`; cross-tenant access is a security bug.

## Tech Stack
| Layer    | Stack |
|----------|-------|
| Frontend | React 19, Vite, TypeScript (strict), Ant Design, React Router v7, TanStack Query, Zustand, Axios, React Hook Form, Zod, DayJS, ECharts |
| Backend  | NestJS, TypeScript (strict), MongoDB + Mongoose, JWT + Passport, BullMQ + Redis, Swagger, Docker |

## Architecture Rules
- Clean Architecture + SOLID + Repository Pattern.
- Feature-based folder structure; backend organized as NestJS modules.
- `frontend/` and `backend/` are fully separated apps.
- DTO validation on every endpoint (class-validator); Zod on frontend forms.
- Global error handling (exception filter), response interceptor (uniform envelope), structured logging, pagination on all list endpoints.
- Authentication guards + RBAC guards on all protected routes; tenant guard injects/validates workspace context.
- No hardcoded values — everything via config (`@nestjs/config` + validated env schema; frontend via `import.meta.env`).
- No duplicate code — extract shared/reusable components, hooks, utils.

## Workflow
- Build **one module completely** (schema → repository → service → controller → DTOs → tests) before starting the next.
- When writing code, explain: Why, Folder, File, Code, Testing, Next Step.

## Commands
Backend (run inside `backend/`):
- `npm run start:dev` — dev server with watch (needs MongoDB at MONGODB_URI)
- `npm run build` — compile
- `npm test` / `npm run test:cov` — unit tests (no DB required)
- `npm run lint` — ESLint (type-checked) + Prettier

Infra: `docker compose up -d mongodb redis` from repo root (Docker not installed on this machine yet — needs Docker Desktop or a local/Atlas MongoDB for the dev server).

## Conventions established in Module 1
- All endpoints live under `/api/v1/...` (URI versioning).
- Success envelope: `{ success, statusCode, data, meta?, timestamp, path }`; errors: `{ success: false, statusCode, message, errors?, timestamp, path }` (see `backend/src/common/interfaces/api-response.interface.ts`).
- List endpoints: extend `PaginationQueryDto`, return `PaginatedResult` from `BaseRepository.paginate()`.
- New feature repositories extend `backend/src/common/repositories/base.repository.ts`.
- New env vars: add to `EnvironmentVariables` (validation), a `registerAs` config namespace, `.env.example`, and `.env`.
