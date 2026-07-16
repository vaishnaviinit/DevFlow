<div align="center">

# DevFlow

**One workspace for developer teams — project management, chat, whiteboards, GitHub, and AI, without the tab-switching.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A520-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/contributing.md)
[![Backend](https://img.shields.io/badge/backend-auth%20in%20progress-yellow.svg)](#-project-status)
[![Frontend](https://img.shields.io/badge/frontend-scaffolding-lightgrey.svg)](#-project-status)

<!-- Replace `your-org/devflow` once the repository is published. -->
![Stars](https://img.shields.io/badge/stars-–-lightgrey?logo=github)
![Issues](https://img.shields.io/badge/issues-–-lightgrey?logo=github)

</div>

---

> [!WARNING]
> **DevFlow is in early, active development.** Today only the **authentication module** is implemented and working. Every other module (workspaces, projects, tasks, chat, whiteboard, GitHub, notifications, AI) is **planned** — the folders exist as placeholders. This README marks status honestly so you always know what's real. Sections tagged `Planned` describe intended design, not shipped code.

---

## Table of Contents

- [Project Vision](#-project-vision)
- [Project Status](#-project-status)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Authentication Flow](#-authentication-flow)
- [Request Lifecycle](#-request-lifecycle)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Security](#-security)
- [Development Workflow](#-development-workflow)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [Documentation](#-documentation)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🎯 Project Vision

Developer teams stitch their day together from a fistful of tools: GitHub for code, Jira or Trello for tasks, Slack or Discord for chat, Miro for diagrams, Notion for docs, Google Meet for calls. Each is good on its own. Together they create a tax:

- **Context switching** — the work lives in one tab, the conversation about it in another, the task tracking it in a third.
- **Lost context** — a decision made in chat never makes it back to the task; a PR merges without the board knowing.
- **Setup overhead** — every new project means wiring the same five tools together again.

**DevFlow brings these into one workspace.** A task, the discussion around it, the whiteboard that sketched it, and the GitHub activity that closes it all live in the same place and share the same real-time state.

**Target users:** small-to-mid engineering teams, open-source projects, student and hackathon teams, and solo developers who want one home for their work.

**Long-term vision:** an extensible, production-grade collaboration platform with clean architecture — the kind of codebase a small team can actually maintain and grow, not a demo. See [docs/vision.md](docs/vision.md).

---

## 🚦 Project Status

| Module | Status | Notes |
|---|---|---|
| **Authentication** | ✅ Working | Register, login, JWT, protected `/me` |
| Workspaces | 🧭 Planned | Prisma models exist (`Workspace`, `WorkspaceMember`) |
| Projects | 🧭 Planned | Placeholder module |
| Tasks | 🧭 Planned | Placeholder module |
| Chat | 🧭 Planned | Placeholder module |
| Whiteboard | 🧭 Planned | Placeholder module |
| GitHub Integration | 🧭 Planned | Placeholder module |
| Notifications | 🧭 Planned | Placeholder module |
| Realtime (Socket.IO) | 🧭 Planned | Dependency installed, not yet wired |
| AI Assistant | 🧭 Planned | Separate FastAPI service, not started |
| Frontend | 🏗️ Scaffolding | Next.js app initialised, no product UI yet |

> [!NOTE]
> **Legend:** ✅ Working · 🏗️ In progress · 🧭 Planned (design only)

---

## ✨ Features

Each feature lists its **Purpose**, **Status**, and **Future improvements**. Only Authentication is currently implemented.

### 🔐 Authentication — ✅ Working
- **Purpose:** Register and sign in users; issue JWTs; protect routes.
- **Now:** Email/password registration, bcrypt hashing, JWT login, `authenticate` middleware, protected `GET /me` returning the live user record, Zod validation, rate limiting on auth routes.
- **Future:** Refresh tokens + logout, email verification, password reset, OAuth (GitHub), role-based access control.

### 🏢 Workspace Management — 🧭 Planned
- **Purpose:** Group teams; own projects, chat, and boards; manage members and roles.
- **Now:** `Workspace` and `WorkspaceMember` models with an `OWNER / ADMIN / MEMBER` role enum.
- **Future:** Create/manage workspaces, member invites, role-based permissions.

### 📋 Projects — 🧭 Planned
- **Purpose:** Organise work inside a workspace. **Future:** project CRUD, membership, activity.

### ✅ Tasks — 🧭 Planned
- **Purpose:** Track units of work. **Future:** Kanban board, status/priority, assignees, due dates.

### 💬 Chat — 🧭 Planned
- **Purpose:** Per-workspace conversation. **Future:** real-time messaging, presence, typing indicators.

### 🔔 Notifications — 🧭 Planned
- **Purpose:** Surface task, project, and GitHub events. **Future:** in-app feed, read state, push delivery.

### 🐙 GitHub Integration — 🧭 Planned
- **Purpose:** Bring repo activity into the workspace. **Future:** OAuth, repo/PR/issue sync, commit insights.

### 🎨 Whiteboard — 🧭 Planned
- **Purpose:** Shared visual canvas. **Future:** shapes/text/sticky notes, real-time multi-user sync.

### 🤖 AI Assistant — 🧭 Planned
- **Purpose:** Assist with summaries, search, and Q&A over workspace content.
- **Future:** a separate **FastAPI + LangChain** service with a vector database for retrieval.

### ⚡ Realtime Collaboration — 🧭 Planned
- **Purpose:** Live updates across chat, board, and tasks. **Future:** Socket.IO rooms per workspace.

### 📄 Document Processing — 🧭 Planned
- **Purpose:** Ingest and index documents for AI retrieval. **Future:** upload → chunk → embed → vector store.

---

## 📸 Screenshots

> [!NOTE]
> Placeholders — the product UI is not built yet. Images will be added as each module ships.

| | |
|---|---|
| **Dashboard** — `docs/assets/dashboard.png` _(TODO)_ | **Workspace** — `docs/assets/workspace.png` _(TODO)_ |
| **Projects** — `docs/assets/projects.png` _(TODO)_ | **Tasks** — `docs/assets/tasks.png` _(TODO)_ |
| **Chat** — `docs/assets/chat.png` _(TODO)_ | **Whiteboard** — `docs/assets/whiteboard.png` _(TODO)_ |
| **GitHub Integration** — `docs/assets/github.png` _(TODO)_ | **AI Assistant** — `docs/assets/ai.png` _(TODO)_ |

---

## 🧰 Tech Stack

**Frontend**

| Tool | Version | Role |
|---|---|---|
| Next.js | 16.x | React framework (App Router) |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |

**Backend**

| Tool | Version | Role |
|---|---|---|
| Node.js | ≥ 20 | Runtime |
| Express | 5.x | HTTP framework |
| TypeScript | 5.x | Type safety |
| Zod | 4.x | Request validation |

**Database**

| Tool | Version | Role |
|---|---|---|
| PostgreSQL | 14+ | Primary datastore |
| Prisma ORM | 6.x | Schema, migrations, queries |

**Authentication**

| Tool | Role |
|---|---|
| jsonwebtoken | JWT signing/verification |
| bcryptjs | Password hashing |

**Realtime** _(planned)_

| Tool | Role |
|---|---|
| Socket.IO | WebSocket rooms |
| Redis / ioredis | Pub/sub, presence, socket scaling |

**AI Service** _(planned)_

| Tool | Role |
|---|---|
| FastAPI | Python AI service |
| LangChain | LLM orchestration |
| Vector DB | Embedding retrieval |

**Deployment & Tooling**

| Tool | Role |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| ts-node-dev | Backend dev server |
| ESLint | Linting |

> [!NOTE]
> `socket.io`, `redis`, and `ioredis` are installed in the backend but **not wired up yet**. They're listed here as the intended stack.

---

## 🏗️ Architecture

DevFlow is a **modular monolith**: one Express backend split into self-contained feature modules (`routes → controller → service → Prisma`), a Next.js frontend, and a planned standalone AI service. The monolith keeps a small team productive; module boundaries leave room to split services later. Full rationale in [docs/architecture.md](docs/architecture.md).

```mermaid
flowchart LR
    subgraph Client
      FE["Next.js Frontend"]
    end
    subgraph Server["Express Backend (modular monolith)"]
      API["REST API"]
      WS["Socket.IO<br/>(planned)"]
    end
    DB[("PostgreSQL")]
    REDIS[("Redis<br/>(planned)")]
    AI["AI Service<br/>FastAPI + LangChain<br/>(planned)"]
    LLM["LLM / Vector DB<br/>(planned)"]

    FE -->|HTTPS / REST| API
    FE -.->|WebSocket| WS
    API --> DB
    WS -.-> REDIS
    API -.->|internal call| AI
    AI -.-> LLM
```

---

## 📁 Folder Structure

```text
devFlow/
├── README.md
├── docs/                      # Project documentation (this set)
├── frontend/                  # Next.js app (App Router)
│   └── src/app/               # Routes, layout, global styles
└── backend/
    ├── prisma/
    │   ├── schema.prisma      # Data model — source of truth
    │   └── migrations/        # Versioned SQL migrations
    └── src/
        ├── index.ts           # App entry: middleware, routes, error handling
        ├── config/            # Cross-cutting setup
        │   ├── env.ts         #   Zod-validated environment (fails fast)
        │   └── prisma.ts      #   PrismaClient singleton
        ├── middleware/        # Reusable Express middleware
        │   ├── auth.middleware.ts     # JWT verification → req.user
        │   ├── validate.middleware.ts # Zod body validation
        │   └── error.middleware.ts    # Central error handler + 404
        ├── utils/             # Shared helpers
        │   ├── app-error.ts   #   AppError + status factories
        │   ├── async-handler.ts #  Async controller wrapper
        │   ├── jwt.ts         #   Sign/verify access tokens
        │   └── response.ts    #   Success response envelope
        └── modules/           # One folder per feature
            ├── auth/          # ✅ implemented
            │   ├── auth.routes.ts
            │   ├── auth.controller.ts
            │   ├── auth.service.ts
            │   └── auth.validation.ts
            ├── workspace/     # 🧭 placeholder
            ├── project/       # 🧭 placeholder
            ├── task/          # 🧭 placeholder
            ├── chat/          # 🧭 placeholder
            ├── whiteboard/    # 🧭 placeholder
            ├── github/        # 🧭 placeholder
            └── notification/  # 🧭 placeholder
```

**Why this layout:**

- **Feature modules over layer folders.** Everything for a feature lives together, so you read and change one folder instead of hopping across `controllers/`, `services/`, `routes/`. New feature = new folder following the same four-file pattern.
- **`config/` and `utils/` are shared and thin.** Cross-cutting concerns (env, Prisma, errors) sit in one place; modules import them, never each other's internals.
- **Prisma schema is the single source of truth** for the data model; migrations are versioned alongside it.

More detail: [docs/folder-structure.md](docs/folder-structure.md) · [docs/backend.md](docs/backend.md).

```mermaid
graph TD
    Routes --> Controllers
    Controllers --> Services
    Services --> Prisma
    Services --> Utils
    Routes --> Middleware
    Controllers -.uses.-> Utils
```

---

## 🔑 Authentication Flow

DevFlow uses **stateless JWT** auth. On login the server verifies the password with bcrypt and returns a signed token; the client sends it as `Authorization: Bearer <token>` on protected routes.

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Express (auth)
    participant V as Zod Validation
    participant DB as PostgreSQL

    C->>A: POST /api/auth/login { email, password }
    A->>V: validate body
    V-->>A: parsed input
    A->>DB: find user by email
    DB-->>A: user (or none)
    A->>A: bcrypt.compare (constant-time)
    A->>A: sign JWT { sub, email }
    A-->>C: 200 { success, data: { user, token } }
```

**Protected route:**

```mermaid
flowchart TD
    R["Request + Bearer token"] --> M["authenticate middleware"]
    M --> V{"Token valid?"}
    V -->|No| E["401 via central error handler"]
    V -->|Yes| U["Attach req.user = { id, email }"]
    U --> Ctrl["Controller"]
    Ctrl --> Res["Response"]
```

Security notes: passwords are bcrypt-hashed (cost 12), the password hash never leaves the service layer (Prisma `select`), login is constant-time to avoid user enumeration, and `JWT_SECRET` is validated (≥ 32 chars) at boot. Full write-up: [docs/authentication.md](docs/authentication.md).

---

## 🔄 Request Lifecycle

Every request flows through the same predictable stages. Each layer has one job.

```mermaid
flowchart TD
    Client --> Route["Express Route"]
    Route --> Validate["Zod Validation (validate middleware)"]
    Validate --> Controller["Controller (HTTP in/out)"]
    Controller --> Service["Service (business logic)"]
    Service --> Prisma["Prisma"]
    Prisma --> DB[("PostgreSQL")]
    DB --> Response["Response { success, data }"]
    Service -.throws.-> ErrH["Central Error Handler"]
    ErrH -.-> Response
```

- **Route** declares the endpoint and its middleware chain.
- **Validation** rejects bad input before any logic runs.
- **Controller** reads the request and shapes the response — no business logic.
- **Service** holds the logic and is the only layer that talks to Prisma.
- **Errors** are thrown as `AppError` and formatted in one place.

---

## 🚀 Getting Started

### Requirements

- **Node.js ≥ 20** and npm
- **PostgreSQL 14+** running locally (or a hosted URL)
- Git

### 1. Clone

```bash
git clone https://github.com/your-org/devflow.git
cd devflow
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env       # then fill in the values (see below)
```

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Database

```bash
# From backend/ — applies migrations and generates the Prisma client
npm run prisma:migrate
npm run prisma:generate
```

### 4. Run the backend

```bash
npm run dev        # http://localhost:5000  (GET /health → { status: "ok" })
```

### 5. Run the frontend

```bash
cd ../frontend
npm install
npm run dev        # http://localhost:3000
```

### Scripts

| Location | Script | Description |
|---|---|---|
| backend | `npm run dev` | Start dev server with hot reload |
| backend | `npm run build` | Compile TypeScript to `dist/` |
| backend | `npm start` | Run compiled server |
| backend | `npm run typecheck` | Type-check without emitting |
| backend | `npm run prisma:migrate` | Create/apply a migration (dev) |
| backend | `npm run prisma:studio` | Open Prisma Studio |
| frontend | `npm run dev` | Start Next.js dev server |
| frontend | `npm run build` | Production build |
| frontend | `npm run lint` | Lint |

---

## 🔧 Environment Variables

Backend variables, validated at startup by [config/env.ts](backend/src/config/env.ts). The server **refuses to start** if a required value is missing or invalid.

| Variable | Description | Required | Example |
|---|---|---|---|
| `NODE_ENV` | Runtime mode | No | `development` |
| `PORT` | Backend port | No (default `5000`) | `5000` |
| `CORS_ORIGIN` | Allowed frontend origins (comma-separated) | No (default `http://localhost:3000`) | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | **Yes** | `postgresql://user:pass@localhost:5432/devflow` |
| `JWT_SECRET` | Token signing secret (**≥ 32 chars**) | **Yes** | `a-64-char-random-hex-string…` |
| `JWT_EXPIRES_IN` | Access token lifetime | No (default `7d`) | `7d` |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost (10–15) | No (default `12`) | `12` |

---

## 🌐 API Overview

The API is REST over JSON under `/api`, grouped by module. Every response uses a consistent envelope:

```jsonc
// success
{ "success": true, "data": { /* ... */ } }
// error
{ "success": false, "message": "Human-readable reason" }
```

**Available today** (`/api/auth`):

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Create an account, return user + token |
| `POST` | `/api/auth/login` | — | Authenticate, return user + token |
| `GET` | `/api/auth/me` | Bearer | Return the current authenticated user |
| `GET` | `/health` | — | Liveness check |

All other module routes are **planned**. Endpoint-level docs will grow in [docs/api.md](docs/api.md) as modules ship — this README stays a high-level overview by design.

---

## 🛡️ Security

| Area | Current | Planned |
|---|---|---|
| **Passwords** | bcrypt, cost 12, never returned to client | — |
| **JWT** | Signed HS256, `sub`+`email` claims, secret validated ≥ 32 chars | Refresh tokens, rotation, logout/revocation |
| **Protected routes** | `authenticate` middleware verifies Bearer token | RBAC via `WorkspaceRole` |
| **Validation** | Zod on every request body | Shared schemas across modules |
| **Transport** | Helmet security headers, restricted CORS | HTTPS enforced in prod |
| **Abuse** | Rate limit on `/api/auth` (20 / 15 min) | Account lockout, per-route limits |
| **Secrets** | Fail-fast env validation, `.env` gitignored | Managed secrets in deployment |
| **Errors** | Central handler; stack traces hidden in prod | Structured logging + request IDs |

Details and threat notes: [docs/authentication.md](docs/authentication.md).

---

## 🧑‍💻 Development Workflow

```mermaid
flowchart LR
    A["feature/branch"] --> B["Commit<br/>(Conventional Commits)"]
    B --> C["Pull Request"]
    C --> D["Review + checks"]
    D --> E["Merge to main"]
    E --> F["Deploy<br/>Vercel / Render"]
```

1. Branch from `main` — `feature/<name>`, `fix/<name>`, `docs/<name>`.
2. Commit using [Conventional Commits](https://www.conventionalcommits.org) (e.g. `feat(auth): add refresh tokens`).
3. Open a PR; keep it focused and describe the change.
4. Review + `npm run typecheck` must pass.
5. Squash-merge to `main`.

More: [docs/development-workflow.md](docs/development-workflow.md).

---

## 🤝 Contributing

Contributions are welcome. In short:

- **Branches:** `feature/…`, `fix/…`, `docs/…`, `refactor/…`
- **Commits:** Conventional Commits
- **Code style:** TypeScript strict mode, feature-module layout, services hold logic, controllers stay thin
- **Before pushing:** `npm run typecheck` (and tests, once they exist)

Full guide: [docs/contributing.md](docs/contributing.md) · conventions: [docs/coding-guidelines.md](docs/coding-guidelines.md).

---

## 🗺️ Roadmap

**Current**
- [x] Project scaffolding (backend + frontend)
- [x] Prisma schema + migrations (User, Workspace, WorkspaceMember)
- [x] Authentication (register, login, JWT, `/me`)
- [x] Security baseline (Helmet, CORS, rate limiting, env validation, central errors)

**Next**
- [ ] Refresh tokens, logout, RBAC
- [ ] Workspace module (create, invite, roles)
- [ ] Project & Task modules (Kanban)
- [ ] Frontend auth + dashboard UI

**Future**
- [ ] Real-time chat & presence (Socket.IO + Redis)
- [ ] Collaborative whiteboard
- [ ] GitHub integration (OAuth, repo/PR/issue sync)
- [ ] Notifications

**Long term**
- [ ] AI assistant (FastAPI + LangChain + vector DB)
- [ ] Document processing pipeline
- [ ] WebRTC meetings
- [ ] Horizontal scaling (socket adapter, queues, workers)

---

## 📚 Documentation

| Doc | What's inside |
|---|---|
| [architecture.md](docs/architecture.md) | System architecture, boundaries, scaling path |
| [system-design.md](docs/system-design.md) | Current vs future design, caching, queues, scaling |
| [backend.md](docs/backend.md) | Backend patterns: controllers, services, middleware |
| [frontend.md](docs/frontend.md) | Frontend structure and conventions |
| [authentication.md](docs/authentication.md) | Auth flow, JWT, security considerations |
| [database.md](docs/database.md) | Prisma schema, relationships, migrations |
| [api.md](docs/api.md) | API conventions and endpoints |
| [folder-structure.md](docs/folder-structure.md) | Folder layout and rationale |
| [deployment.md](docs/deployment.md) | Vercel + Render deployment |
| [development-workflow.md](docs/development-workflow.md) | Branching, commits, PRs |
| [coding-guidelines.md](docs/coding-guidelines.md) | Code style and conventions |
| [contributing.md](docs/contributing.md) | How to contribute |
| [roadmap.md](docs/roadmap.md) | Detailed roadmap |
| [future-features.md](docs/future-features.md) | Planned features in depth |
| [vision.md](docs/vision.md) | Product vision |

> [!NOTE]
> The `docs/` set is being built out. Some links above point to files that are being written; existing docs are being upgraded to this standard, not overwritten.

---

## 📄 License

Released under the **MIT License**. See [LICENSE](LICENSE). _(TODO: add a `LICENSE` file if one isn't present.)_

---

## 🙏 Acknowledgements

Built with the work of the open-source community — [Express](https://expressjs.com), [Prisma](https://www.prisma.io), [Next.js](https://nextjs.org), [Zod](https://zod.dev), [Socket.IO](https://socket.io), and others.

Documentation structure inspired by mature open-source projects such as Prisma, Supabase, and Cal.com.
