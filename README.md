# FinSync AI

AI-powered, multi-tenant family financial management SaaS.

Each registered user creates a **Family Workspace** (tenant). Families track
income, expenses, savings, investments, goals and net worth, and receive
AI-driven analysis and wealth predictions. Tenant data is fully isolated —
no family can ever access another family's data.

## Repository layout

```
FinSync-AI/
├── frontend/            # React 19 + Vite + TypeScript + Ant Design SPA
├── backend/             # NestJS + MongoDB modular API
├── docs/                # Architecture and design documentation
├── docker/              # Infra configuration (deploy-time assets)
├── docker-compose.yml   # Local/dev stack: MongoDB, Redis, backend
└── CLAUDE.md            # Engineering standards (enforced in every session)
```

## Tech stack

| Layer    | Stack |
|----------|-------|
| Frontend | React 19, Vite, TypeScript (strict), Ant Design, React Router v7, TanStack Query, Zustand, Axios, React Hook Form, Zod, DayJS, ECharts |
| Backend  | NestJS 11, TypeScript (strict), MongoDB + Mongoose, JWT + Passport, BullMQ + Redis, Swagger, Docker |

## Getting started

Prerequisites: Node.js ≥ 20, and either Docker (recommended) or local
MongoDB + Redis.

```bash
# 1. Infrastructure
docker compose up -d mongodb redis

# 2. Backend (http://localhost:3000/api/v1, Swagger at /api/docs)
cd backend
cp .env.example .env       # fill in JWT secrets
npm install
npm run start:dev

# 3. Frontend (http://localhost:5173)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Quality gates

Run before every commit, in each app directory:

```bash
npm run build   # strict TypeScript compile
npm run lint    # ESLint (type-checked) + Prettier
npm test        # backend unit tests
```

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — full architecture: folder
  responsibilities, module communication, multi-tenancy design, RBAC.
