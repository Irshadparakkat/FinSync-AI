# Features

Each folder is a self-contained vertical slice of the product. A feature owns
everything specific to it and exposes a minimal public surface through its
`index.ts` barrel — other features import **only** from that barrel, never from
internal files.

## Mandatory anatomy of a feature

```
features/<name>/
├── api/            # API calls for this feature (uses lib/api-client, unwrap helpers)
├── components/     # UI components used only by this feature
├── hooks/          # TanStack Query hooks (useIncomeList, useCreateExpense, ...)
├── pages/          # Route-level screens, lazy-loaded by app/router
├── types/          # Feature-specific TypeScript types (mirror backend DTOs)
├── validation/     # Zod schemas for this feature's forms
└── index.ts        # Public barrel - the ONLY import path for other modules
```

If something is needed by two or more features, it moves up to the shared
layer (`src/components`, `src/hooks`, `src/utils`) — never cross-import
between features.

## Planned features

| Folder        | Scope |
|---------------|-------|
| `auth/`       | Login, register, token refresh, route guards |
| `family/`     | Workspace (tenant) settings, invitations |
| `members/`    | Family member management, roles |
| `dashboard/`  | Overview widgets, net worth summary |
| `income/`     | Income sources and records |
| `expenses/`   | Expense tracking, categories |
| `savings/`    | Savings accounts and contributions |
| `investments/`| Investment portfolio tracking |
| `goals/`      | Financial goals and progress |
| `reports/`    | Charts and exports (ECharts) |
| `ai-insights/`| AI analysis and wealth prediction |
| `admin/`      | Super-admin platform dashboard |
