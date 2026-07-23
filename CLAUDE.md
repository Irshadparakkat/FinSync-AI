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

Frontend (run inside `frontend/`):
- `npm run dev` — Vite dev server on :5173
- `npm run build` — strict `tsc -b` + vite build
- `npm run lint` / `npm run format` — ESLint + Prettier
- Path alias: `@/` → `src/`. Feature anatomy documented in `frontend/src/features/README.md`.
- State split: server state → TanStack Query; global client state → Zustand; forms → RHF+Zod. Never mix.

Infra: `docker compose up -d mongodb redis` from repo root (Docker not installed on this machine yet — needs Docker Desktop or a local/Atlas MongoDB for the dev server).

Architecture reference: `docs/architecture.md` (folder responsibilities, module communication, tenancy layers, ADRs).

## Conventions established in Module 1
- All endpoints live under `/api/v1/...` (URI versioning).
- Success envelope: `{ success, statusCode, data, meta?, timestamp, path }`; errors: `{ success: false, statusCode, message, errors?, timestamp, path }` (see `backend/src/common/interfaces/api-response.interface.ts`).
- List endpoints: extend `PaginationQueryDto`, return `PaginatedResult` from `BaseRepository.paginate()`.
- New feature repositories extend `backend/src/common/repositories/base.repository.ts`.
- New env vars: add to `EnvironmentVariables` (validation), a `registerAs` config namespace, `.env.example`, and `.env`.

## Conventions established in Module 2 (Auth)
- Secure by default: `JwtAuthGuard` is a global `APP_GUARD`; unauthenticated routes must opt out with `@Public()` (health, register, login, refresh).
- Controllers get the principal via `@CurrentUser() user: AuthenticatedUser` (`{ userId, email }`).
- Refresh tokens rotate on every use and are stored bcrypt-hashed (`select: false`); logout clears the hash.
- Sensitive schema fields use `select: false`; reads opt in via repository methods only (`findByEmailWithPassword`).
- API responses map documents through explicit allowlist DTOs (`UserResponseDto.from()`), never raw Mongoose docs.
- Auth tuning values live in `modules/auth/constants/auth.constants.ts` (bcrypt rounds, password min length).
- User model: single `name` field; `role` enum (`SUPER_ADMIN`/`FAMILY_OWNER`/`FAMILY_MEMBER`, in `common/enums/user-role.enum.ts`); `familyId` (null until workspace exists). JWT claims + `AuthenticatedUser` carry `{userId, email, role, familyId}` — role/familyId re-read from DB per request in JwtStrategy.
- RBAC: `@Roles(...)` + global `RolesGuard` (403). Register returns `{message}` only (no auto-login); login returns `{accessToken, refreshToken, user}`.
- Frontend auth: session in `stores/auth.store.ts` (zustand persist, key `finsync-auth`); api-client attaches Bearer + single-flight 401 refresh/retry; `ProtectedRoute` guards routes; router lazy-loads feature pages (only file allowed to deep-import them).

## Conventions established in Module 3 (Shell + Family Workspace)
- Tenancy enforcement: `FamilyContextGuard` (modules/family/guards) 403s principals without a `familyId`; tenant-scoped repositories extend `common/repositories/tenant.repository.ts` (every method REQUIRES familyId — cross-tenant queries are unrepresentable). The tenant id always comes from the JWT principal, never from params/body.
- Family: one workspace per user (`POST /families` 409s if familyId set; promotes creator via `UsersService.assignFamily`). `familyCode` = `FAM-XXXXXX` (crypto random, unique index + retry). `membersCount` is denormalized, maintained atomically (`$inc`) by MembersService only.
- Age is NEVER stored — schemas keep `dateOfBirth` only; DTOs derive `age` via `common/utils/age.util.ts` at read time. DTOs accept dates as ISO strings (`@IsISO8601`), services convert + reject future dates.
- New folder shape for feature modules: `controllers/ services/ dto/ schemas/ repository/ interfaces/ enums/ guards/ constants/` (family, members). Users module stays flat (Module-1 style).
- `profileImage` fields accept https URLs or base64 data URIs (`VALIDATION.PROFILE_IMAGE_REGEX`, 300k char cap); JSON body limit raised to 1mb in main.ts. `ParseObjectIdPipe` (common/pipes) guards all `:id` params.
- Profile self-service: `GET/PATCH /users/me` (UsersController). Members writes are `@Roles(FAMILY_OWNER)`; reads open to all family roles.
- Frontend shell: `layouts/AppLayout/` (desktop Sider + mobile Drawer + sticky header) wraps ALL protected routes; nav lives in `nav-config.tsx` (keys ARE route paths); sidebar collapse persisted in `stores/ui.store.ts` (key `finsync-ui`). Dark-only theme via `theme/index.ts` (algorithm + `palette` export).
- Frontend forms: RHF+Zod through shared `components/form/Controlled*` bridges + `AvatarUpload` (base64). Shared UI in `components/common/` (UserAvatar, RoleBadge, StatCard, PageHeader, EmptyState, AppModal, DataTable wired to PaginationMeta, PageTransition). Future-module routes render `pages/ComingSoonPage`; admin routes wrapped in `RequireRole` (features/auth).
