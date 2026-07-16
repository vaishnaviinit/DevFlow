# Folder Structure

> The full repository layout, what each folder is for, and the reasoning behind the organisation.
> Related: [backend.md](backend.md) · [architecture.md](architecture.md) · [frontend.md](frontend.md)

---

## Purpose

This document is a map of the repository. It explains where things live and why, so you can find the right place to add code and understand code you did not write.

---

## Top Level

```text
devFlow/
├── README.md          # Project overview and entry point
├── LICENSE            # MIT license
├── docs/              # Project documentation (this set)
├── backend/           # Node.js + Express API
└── frontend/          # Next.js web application
```

The repository is a **monorepo**: the backend and frontend live together in one repository but are separate applications with their own dependencies. This keeps related changes (for example, an API change and the UI that uses it) in one place, while each app still builds and deploys independently.

---

## Backend

```text
backend/
├── prisma/
│   ├── schema.prisma          # Data model — the single source of truth
│   └── migrations/            # Versioned SQL migration history
├── src/
│   ├── index.ts               # Entry point: middleware, routes, error handlers
│   ├── config/                # Application-wide setup
│   │   ├── env.ts             #   Reads and validates environment variables
│   │   └── prisma.ts          #   The single PrismaClient instance
│   ├── middleware/            # Reusable Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/                 # Small shared helpers
│   │   ├── app-error.ts
│   │   ├── async-handler.ts
│   │   ├── jwt.ts
│   │   └── response.ts
│   └── modules/               # One folder per feature
│       └── auth/
│           ├── auth.routes.ts
│           ├── auth.controller.ts
│           ├── auth.service.ts
│           └── auth.validation.ts
├── .env.example               # Template for environment variables
├── package.json
└── tsconfig.json
```

### What each folder is for

| Folder | Purpose | Why it exists |
|---|---|---|
| `prisma/` | Schema and migrations | Keeps the data model and its history in one versioned place |
| `src/config/` | Environment and database client | Cross-cutting setup that many modules use; loaded once |
| `src/middleware/` | Auth, validation, error handling | Reusable request-processing steps shared across modules |
| `src/utils/` | Errors, responses, JWT, async wrapper | Small, dependency-light helpers used everywhere |
| `src/modules/` | Feature code | Each feature is self-contained and independent |

### Why feature modules, not layer folders

A common alternative is to group by technical layer: all controllers in `controllers/`, all services in `services/`, and so on. DevFlow groups by **feature** instead.

- To change the auth feature, you open `modules/auth/` and see everything it involves — routes, controller, service, validation — together.
- With layer folders, the same change means editing four files in four distant directories, and the folders grow endlessly as features are added.
- A new feature is a new folder that follows the same four-file pattern, so the structure scales without becoming a pile of unrelated files.

The tradeoff is a little more ceremony for a very small feature, which is well worth the long-term clarity.

---

## Frontend

```text
frontend/
├── src/
│   └── app/               # Next.js App Router
│       ├── layout.tsx     # Root layout
│       ├── page.tsx       # Home page
│       └── globals.css    # Global styles (Tailwind)
├── public/                # Static assets
├── next.config.ts
├── tsconfig.json
└── package.json
```

The frontend is a standard Next.js App Router project. It is currently the default starter with no product screens yet. Details and conventions are in [frontend.md](frontend.md).

---

## Documentation

```text
docs/
├── architecture.md          # System architecture
├── system-design.md         # Scaling, caching, queues
├── backend.md               # Backend patterns
├── frontend.md              # Frontend structure
├── authentication.md        # Auth and security
├── database.md              # Data model and migrations
├── api.md                   # API conventions and endpoints
├── folder-structure.md      # This file
├── deployment.md            # Deployment guide
├── development-workflow.md  # Branching, commits, PRs
├── coding-guidelines.md     # Code style and conventions
├── contributing.md          # How to contribute
├── roadmap.md               # Roadmap
├── future-features.md       # Planned features in depth
└── vision.md                # Product vision
```

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Module folders | Lowercase, singular | `auth`, `project`, `task` |
| Backend files | `kebab-case`, with a role suffix | `auth.controller.ts`, `app-error.ts` |
| React components | `PascalCase` | `TaskCard.tsx` |
| Variables and functions | `camelCase` | `registerUser`, `authLimiter` |
| Types and interfaces | `PascalCase` | `RegisterInput`, `AuthRequest` |
| Constants | `UPPER_SNAKE_CASE` | `BCRYPT_SALT_ROUNDS` |

Full conventions are in [coding-guidelines.md](coding-guidelines.md).

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Repository layout | Monorepo (backend + frontend) | Related changes stay together; apps stay independent |
| Backend organisation | Feature modules | Change a feature in one folder |
| Shared code | `config/` and `utils/` | One home for cross-cutting concerns |
| File naming | Role-suffixed kebab-case | Predictable and searchable |

---

## Best Practices

- Put new feature code in its own folder under `src/modules/`, following the four-file pattern.
- Keep shared helpers in `utils/` small and free of feature-specific logic.
- Do not import one module's internal files from another; share through a service function.
- Name a file after its role so its purpose is clear from the tree alone.

---

## Developer Notes

- Non-auth module folders under `src/modules/` are empty placeholders that mark intended structure.
- The backend and frontend each have their own `package.json`; run npm commands from inside the relevant folder.
- The Prisma generated client is git-ignored and produced by `npm run prisma:generate`.

---

_Next: [frontend.md](frontend.md) — the frontend structure and conventions._
