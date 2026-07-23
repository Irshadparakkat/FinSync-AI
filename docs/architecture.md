# FinSync AI — Architecture

Production-grade, multi-tenant family-finance SaaS. This document is the
authoritative description of the system's structure, the reasoning behind it,
and the rules every new module must follow.

---

## 1. System overview

```
┌─────────────────┐     HTTPS (JSON envelope)     ┌──────────────────────────┐
│  React SPA       │ ───────────────────────────► │  NestJS API               │
│  (frontend/)     │   /api/v1/*  Bearer JWT      │  (backend/)               │
└─────────────────┘                               │  ┌────────┐  ┌─────────┐ │
                                                  │  │MongoDB │  │ Redis + │ │
                                                  │  │Mongoose│  │ BullMQ  │ │
                                                  │  └────────┘  └─────────┘ │
                                                  └──────────────────────────┘
```

- **One API contract**: every response uses the same envelope —
  success `{ success, statusCode, data, meta?, timestamp, path }`,
  error `{ success: false, statusCode, message, errors?, timestamp, path }`.
- **Versioned URLs** (`/api/v1/...`) so breaking changes never force clients.
- **Multi-tenant**: the Family Workspace is the tenant. Every domain document
  carries a `familyId`; every query is scoped to it (see §5).

## 2. Backend architecture (`backend/`)

NestJS modular monolith following Clean Architecture layering:

```
Controller (HTTP, DTO validation, Swagger)
    │ calls
Service (domain logic, orchestration)
    │ calls
Repository (data access, extends BaseRepository)
    │ uses
Mongoose Model (schema, indexes)
```

### Folder responsibilities

| Path | Responsibility |
|------|----------------|
| `src/main.ts` | Bootstrap: helmet, CORS (config-driven), global ValidationPipe (`whitelist` + `forbidNonWhitelisted`), URI versioning, Swagger (config-gated), graceful shutdown |
| `src/app.module.ts` | Composition root; registers global filter/interceptors/guard via DI tokens |
| `src/config/` | The ONLY place `process.env` is read. Env vars validated at boot (class-validator) — bad config fails deploy, not requests. Namespaced `registerAs` configs (`app`, `database`, `jwt`, later `redis`) |
| `src/common/constants/` | Cross-module tuning values (pagination limits) |
| `src/common/dto/` | `PaginationQueryDto` (all list endpoints extend it), `PaginatedResult` |
| `src/common/filters/` | `AllExceptionsFilter` — uniform error envelope; 5xx internals logged, never leaked |
| `src/common/interceptors/` | `TransformInterceptor` (success envelope), `LoggingInterceptor` (method/path/status/duration; bodies never logged — finance data) |
| `src/common/repositories/` | `BaseRepository<T>` — generic CRUD + pagination; the Repository Pattern root |
| `src/database/` | Mongoose connection (async, from validated config). Feature modules only call `MongooseModule.forFeature()` |
| `src/modules/<feature>/` | One folder per business capability (see module list below) |

### Anatomy of a feature module

```
modules/<feature>/
├── constants/      # feature tuning values
├── dto/            # request DTOs (class-validator) + response DTOs (explicit allowlist mapping)
├── schemas/        # Mongoose schema(s); sensitive fields select:false
├── interfaces/     # internal contracts
├── <feature>.repository.ts   # extends BaseRepository (tenant-scoped ⇒ extends TenantBaseRepository, §5)
├── <feature>.service.ts      # domain logic; depends on services/repos, never other modules' schemas
├── <feature>.controller.ts   # thin HTTP layer
└── <feature>.module.ts       # exports ONLY the service(s) other modules may use
```

### Module list and status

| Module | Status | Notes |
|--------|--------|-------|
| `health` | ✅ built | Terminus liveness + Mongo ping, `@Public()` |
| `users` | ✅ built | Identity records; hashes `select:false` |
| `auth` | ✅ built | JWT access + rotating hashed refresh tokens, global `JwtAuthGuard`, `@Public()`/`@CurrentUser()` |
| `family` | planned | The tenant: workspace + members + roles + invitations; `TenantGuard`, `RolesGuard` |
| `income`, `expenses`, `savings`, `investments`, `goals` | planned | Tenant-scoped finance domains |
| `reports` | planned | Aggregation pipelines feeding charts |
| `ai-analysis` | planned | AI insights + wealth prediction; heavy work on BullMQ queues |
| `notifications` | planned | BullMQ consumers (email etc.) |
| `admin` | planned | Super-admin platform operations |

### How modules communicate

1. **Service-to-service DI only.** A module imports another module (e.g.
   `AuthModule` imports `UsersModule`) and injects its **exported service**.
   Repositories and schemas are module-private — never exported.
2. **No lateral schema access.** If Expenses needs user data, it calls
   `UsersService`, never the User model.
3. **Async workflows via BullMQ.** Long-running work (AI analysis, report
   generation, notifications) is enqueued; consumers live in the owning
   module. Producers and consumers share only the queue name + typed job
   payload — no direct coupling.
4. **Cross-cutting concerns via DI tokens** (`APP_GUARD`, `APP_FILTER`,
   `APP_INTERCEPTOR`) registered once in the composition root.

## 3. Frontend architecture (`frontend/`)

Feature-based React architecture. Rule of thumb: **screaming architecture** —
the folder tree tells you what the product does, not what framework it uses.

| Path | Responsibility |
|------|----------------|
| `src/app/` | Application shell: `providers/` (composition of all global providers) and `router/` (route tree; feature routes lazy-load here) |
| `src/assets/` | Static assets (images, fonts) |
| `src/components/ui/` | Design-system primitives (buttons, stat cards) wrapping Ant Design |
| `src/components/common/` | Shared composite components (page headers, empty states, chart wrappers) |
| `src/config/` | `env.ts` — the ONLY place `import.meta.env` is read; missing vars fail loudly at startup |
| `src/constants/` | Route paths, app-wide values (page sizes, date formats) — single source of truth |
| `src/features/` | Vertical slices (auth, family, members, dashboard, income, expenses, savings, investments, goals, reports, ai-insights, admin). See `src/features/README.md` for the mandatory internal anatomy. Features never import each other's internals |
| `src/hooks/` | Hooks shared by 2+ features |
| `src/layouts/` | Page chrome: auth layout, app shell (sider/header), admin layout |
| `src/lib/` | Infrastructure singletons: `api-client.ts` (one Axios instance + envelope unwrapping + normalized `ApiError`), `query-client.ts` (TanStack Query defaults; 4xx never retried) |
| `src/pages/` | Top-level route glue not owned by a feature (home, 404) |
| `src/services/` | API services shared by multiple features |
| `src/stores/` | Zustand stores for global client state (auth session, active workspace, UI prefs). Server state lives in TanStack Query, NOT here |
| `src/styles/` | Global CSS baseline only |
| `src/theme/` | Ant Design token config — brand changes are a one-file edit; no hardcoded colors in components |
| `src/types/` | Cross-cutting types (`api.types.ts` mirrors the backend envelope) |
| `src/utils/` | Pure helper functions |
| `src/validation/` | Zod schemas shared across features (feature-specific schemas live in the feature) |

### State management split (deliberate)

- **Server state** → TanStack Query (caching, invalidation, retries).
- **Global client state** → Zustand (session, active tenant, UI preferences).
- **Form state** → React Hook Form + Zod resolvers.
- Mixing these (e.g. server data in Zustand) is a code-review rejection.

## 4. Roles & RBAC

| Role | Scope | Capabilities |
|------|-------|--------------|
| **Super Admin** | Platform | Operate the SaaS itself: tenants overview, plan limits, support. Never sees family financial data in normal operation |
| **Family Owner** | Tenant | Full control of one workspace: members, invitations, all finance data, workspace settings |
| **Family Member** | Tenant | Contribute and view within the workspace as granted (record expenses/income, view dashboards) |

Enforced by `RolesGuard` + `@Roles(...)` decorator on the backend (source of
truth) and mirrored in the frontend router guards (UX only — the API never
trusts the client).

## 5. Multi-tenancy design

**Model:** shared database, shared collections, discriminated by an indexed
`familyId` on every tenant-owned document. Right for this product's scale;
isolation is enforced in code at three layers (defense in depth):

1. **Token claims.** After workspace selection, the JWT carries
   `{ sub, email, familyId, role }`. Tenant identity comes from the signed
   token — NEVER from request params or body.
2. **`TenantGuard` (request boundary).** Runs after `JwtAuthGuard` on every
   tenant-scoped route: verifies the user's membership in `familyId` is
   current (revocation-safe) and attaches the tenant context to the request.
3. **`TenantBaseRepository` (data boundary — the backstop).** Extends
   `BaseRepository`; every method REQUIRES a tenant context and injects
   `familyId` into every filter. Feature repositories for tenant data extend
   it, making a cross-tenant query impossible by construction — a forgotten
   `where` clause cannot leak another family's data.

Layer 3 is the critical one: guards can be misconfigured on a new route, but
the repository physically cannot query without a tenant.

**Where tenant validation happens (summary):** authentication at the global
`JwtAuthGuard`, tenant membership + role at `TenantGuard`/`RolesGuard` (route
boundary), and unconditional data scoping inside `TenantBaseRepository` (data
boundary). Controllers and services never handle raw tenant ids from clients.

## 6. Architecture decisions (ADR summary)

| Decision | Rationale |
|----------|-----------|
| Modular monolith, not microservices | One team, one deployable; NestJS modules give the boundaries. Split later along module seams if scale demands |
| Shared-collection tenancy with `familyId` | Family workspaces are small and numerous; per-tenant DBs would explode ops cost. Isolation enforced in the repository layer |
| Global-by-default guard (`APP_GUARD`) | Secure by default: forgetting a decorator can never expose data; public routes opt out explicitly |
| Rotating, hashed refresh tokens | DB leak exposes no usable tokens; a stolen refresh token dies on first legitimate use |
| Uniform response envelope | One Axios interceptor client-side; uniform error UX; pagination metadata standardized |
| Repository Pattern over direct Model use | Services stay ODM-agnostic and testable; tenancy enforcement has a single home |
| Feature-based folders on both sides | Team scales by feature ownership; deleting a feature is deleting a folder |
| BullMQ for AI/report/notification work | These are slow and bursty; queues keep API latency flat and add retry semantics |
