<div align="center">

# DevFlow

**One workspace for developer teams — project management, chat, whiteboards, GitHub, and AI, without switching between tools.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A520-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/contributing.md)
[![Backend](https://img.shields.io/badge/backend-auth%20in%20progress-yellow.svg)](#project-status)
[![Frontend](https://img.shields.io/badge/frontend-scaffolding-lightgrey.svg)](#project-status)

<!-- Replace `your-org/devflow` with the real repository path once published. -->
![Stars](https://img.shields.io/badge/stars-–-lightgrey?logo=github)
![Issues](https://img.shields.io/badge/issues-–-lightgrey?logo=github)

</div>

---

> [!IMPORTANT]
> **DevFlow is in early, active development.** At this point only the **authentication module** is implemented and working. Every other module — workspaces, projects, tasks, chat, whiteboard, GitHub, notifications, and AI — is **planned**. The folders for these modules exist in the codebase but are empty placeholders. This document states the status of each part honestly, so you always know what is real and what is intended. Any section labelled **Planned** describes a design decision, not shipped code.

---

## What is DevFlow?

DevFlow is a web application that gives a software team a single place to do their work. Instead of keeping code in GitHub, tasks in Jira or Trello, conversations in Slack or Discord, diagrams in Miro, and notes in Notion, a team using DevFlow keeps all of these in one connected workspace.

The project has two runnable parts today:

- A **backend** — an HTTP API built with Node.js and Express (TypeScript), storing data in PostgreSQL through the Prisma toolkit.
- A **frontend** — a Next.js (React) web app. It is currently the default starter and has no product screens yet.

If you are new to the project, read the sections in order: [Project Vision](#project-vision) explains *why* it exists, [Architecture](#architecture) explains *how* it is built, and [Getting Started](#getting-started) walks you through running it locally.

---

## Table of Contents

- [Project Vision](#project-vision)
- [Project Status](#project-status)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Authentication Flow](#authentication-flow)
- [Request Lifecycle](#request-lifecycle)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Security](#security)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Project Vision

### The problem

A typical development team uses several separate tools every day:

- **GitHub** for source code and pull requests
- **Jira or Trello** for tasks and planning
- **Slack or Discord** for team chat
- **Miro** for whiteboarding and diagrams
- **Notion** for documentation
- **Google Meet** for calls

Each tool is good on its own, but using them together has a cost:

- **Context switching.** The work is in one browser tab, the discussion about it is in another, and the task that tracks it is in a third.
- **Lost context.** A decision made in chat rarely makes it back into the task. A pull request merges without the task board ever knowing.
- **Repeated setup.** Every new project means connecting the same five tools again.

### The solution

DevFlow brings these activities into one workspace. A task, the discussion around it, the whiteboard used to plan it, and the GitHub activity that completes it all live in the same place and share the same live state. When something changes in one part, the others can react to it.

### Who it is for

- Small to mid-sized engineering teams
- Open-source projects
- Student and hackathon teams
- Individual developers who want one home for their work

### Long-term goal

Build an extensible, production-grade collaboration platform with clean, understandable architecture — a codebase a small team can maintain and grow over time, not a throwaway demo. The full product vision is in [docs/vision.md](docs/vision.md).

---

## Project Status

The table below is the quickest way to understand what currently works.

| Module | Status | Notes |
|---|---|---|
| Authentication | **Working** | Register, login, JWT tokens, protected `/me` endpoint |
| Workspaces | Planned | Database models exist (`Workspace`, `WorkspaceMember`) |
| Projects | Planned | Placeholder module, no logic yet |
| Tasks | Planned | Placeholder module, no logic yet |
| Chat | Planned | Placeholder module, no logic yet |
| Whiteboard | Planned | Placeholder module, no logic yet |
| GitHub Integration | Planned | Placeholder module, no logic yet |
| Notifications | Planned | Placeholder module, no logic yet |
| Realtime (Socket.IO) | Planned | Library installed but not yet connected |
| AI Assistant | Planned | Separate Python service, not started |
| Frontend | Scaffolding | Next.js app created, no product screens yet |

**Status meanings:**

- **Working** — implemented and usable now.
- **In progress** — being built.
- **Planned** — designed but not yet built. Any code references are placeholders or data models only.

---

## Features

Each feature below lists its **purpose**, its **current status**, and **planned improvements**. Only Authentication is implemented today; the rest describe intended behaviour.

### Authentication — Working

- **Purpose:** Let users create an account, sign in, and access protected parts of the API.
- **Now:** Email and password registration, password hashing with bcrypt, login that returns a JSON Web Token (JWT), middleware that protects routes, a `GET /me` endpoint that returns the currently signed-in user, request validation with Zod, and rate limiting on the auth endpoints.
- **Planned:** Refresh tokens and logout, email verification, password reset, sign-in with GitHub, and role-based access control.

> [!NOTE]
> **JWT (JSON Web Token)** is a signed string the server gives the client after login. The client sends it back on later requests to prove who it is, so the server does not need to store a session.

### Workspace Management — Planned

- **Purpose:** Group a team together. A workspace owns its projects, chat, and whiteboards, and controls who can access them.
- **Now:** The `Workspace` and `WorkspaceMember` data models exist, including a role field with values `OWNER`, `ADMIN`, and `MEMBER`.
- **Planned:** Creating and managing workspaces, inviting members, and enforcing role-based permissions.

### Projects — Planned

- **Purpose:** Organise work inside a workspace.
- **Planned:** Creating projects, managing membership, and viewing project activity.

### Tasks — Planned

- **Purpose:** Track individual units of work.
- **Planned:** A Kanban board, task status and priority, assignees, and due dates.

### Chat — Planned

- **Purpose:** Conversation within a workspace.
- **Planned:** Real-time messaging, online presence, and typing indicators.

### Notifications — Planned

- **Purpose:** Tell users about events that concern them, such as a task being assigned.
- **Planned:** An in-app notification feed, read/unread state, and push delivery.

### GitHub Integration — Planned

- **Purpose:** Bring repository activity into the workspace.
- **Planned:** Signing in with GitHub, syncing repositories, pull requests, and issues, and showing commit activity.

### Whiteboard — Planned

- **Purpose:** A shared visual canvas for planning and diagrams.
- **Planned:** Shapes, text, and sticky notes, with real-time multi-user editing.

### AI Assistant — Planned

- **Purpose:** Help users summarise, search, and ask questions about workspace content.
- **Planned:** A separate service built with FastAPI and LangChain, using a vector database to find relevant content.

### Realtime Collaboration — Planned

- **Purpose:** Keep chat, whiteboards, and tasks updated live for everyone.
- **Planned:** Socket.IO connections, with one "room" per workspace.

### Document Processing — Planned

- **Purpose:** Take uploaded documents and make them searchable by the AI assistant.
- **Planned:** A pipeline that uploads a document, splits it into chunks, converts the chunks into embeddings, and stores them in a vector database.

---

## Screenshots

> [!NOTE]
> These are placeholders. The product interface has not been built yet, so there are no screenshots to show. Images will be added here as each module ships.

| View | Image |
|---|---|
| Dashboard | `docs/assets/dashboard.png` (to be added) |
| Workspace | `docs/assets/workspace.png` (to be added) |
| Projects | `docs/assets/projects.png` (to be added) |
| Tasks | `docs/assets/tasks.png` (to be added) |
| Chat | `docs/assets/chat.png` (to be added) |
| Whiteboard | `docs/assets/whiteboard.png` (to be added) |
| GitHub Integration | `docs/assets/github.png` (to be added) |
| AI Assistant | `docs/assets/ai.png` (to be added) |

---

## Tech Stack

The versions below reflect what is actually installed in the project.

### Frontend

| Tool | Version | Role |
|---|---|---|
| Next.js | 16.x | React framework using the App Router |
| React | 19.x | User interface library |
| TypeScript | 5.x | Static typing |
| Tailwind CSS | 4.x | Utility-first styling |

### Backend

| Tool | Version | Role |
|---|---|---|
| Node.js | 20 or newer | JavaScript runtime |
| Express | 5.x | HTTP web framework |
| TypeScript | 5.x | Static typing |
| Zod | 4.x | Validates incoming request data |

### Database

| Tool | Version | Role |
|---|---|---|
| PostgreSQL | 14 or newer | Primary relational database |
| Prisma ORM | 6.x | Defines the schema, runs migrations, and queries the database with type safety |

### Authentication

| Tool | Role |
|---|---|
| jsonwebtoken | Creates and verifies JWT tokens |
| bcryptjs | Hashes passwords before storing them |

### Realtime (Planned)

| Tool | Role |
|---|---|
| Socket.IO | Real-time communication over WebSockets |
| Redis / ioredis | Message pub/sub, presence tracking, and scaling sockets across servers |

### AI Service (Planned)

| Tool | Role |
|---|---|
| FastAPI | Python web framework for the AI service |
| LangChain | Orchestrates calls to language models |
| Vector database | Stores embeddings for content retrieval |

### Deployment and Tooling

| Tool | Role |
|---|---|
| Vercel | Hosts the frontend |
| Render | Hosts the backend |
| ts-node-dev | Runs the backend in development with automatic reload |
| ESLint | Finds code style and quality issues |

> [!NOTE]
> The `socket.io`, `redis`, and `ioredis` packages are already listed as backend dependencies, but they are **not connected to any code yet**. They are shown here as the intended stack.

---

## Architecture

DevFlow's backend is a **modular monolith**. This means it is a single application (one process, one deployment) whose code is divided into independent feature modules. Each module contains everything it needs — its routes, its request handling, its business logic, and its validation — and does not reach into another module's internal files.

**Why this approach:** a small team ships faster with one codebase, one database, and one deployment to manage. Splitting into many small services (microservices) would add network calls and operational complexity that is not worth it at this stage. Keeping clear module boundaries means a module can be separated into its own service later, if and when that is actually needed.

The frontend is a separate Next.js application, and the AI assistant is planned as a separate Python service.

```mermaid
flowchart LR
    subgraph Client["Client"]
      FE["Next.js Frontend"]
    end
    subgraph Server["Express Backend (modular monolith)"]
      API["REST API"]
      WS["Socket.IO gateway<br/>(planned)"]
    end
    DB[("PostgreSQL")]
    REDIS[("Redis<br/>(planned)")]
    AI["AI Service<br/>FastAPI + LangChain<br/>(planned)"]
    LLM["Language model / Vector DB<br/>(planned)"]

    FE -->|HTTPS / REST| API
    FE -.->|WebSocket| WS
    API --> DB
    WS -.-> REDIS
    API -.->|internal call| AI
    AI -.-> LLM
```

The full explanation, including the plan for scaling and for extracting services later, is in [docs/architecture.md](docs/architecture.md) and [docs/system-design.md](docs/system-design.md).

---

## Folder Structure

The tree below shows the important files, with a short note on what each part is for.

```text
devFlow/
├── README.md                  # This file
├── LICENSE                    # MIT license
├── docs/                      # Project documentation
├── frontend/                  # Next.js web app (App Router)
│   └── src/app/               # Routes, layout, and global styles
└── backend/
    ├── prisma/
    │   ├── schema.prisma      # Database schema — the source of truth for data
    │   └── migrations/        # Versioned SQL migration history
    └── src/
        ├── index.ts           # App entry point: middleware, routes, error handling
        ├── config/            # Application-wide setup
        │   ├── env.ts         #   Reads and validates environment variables
        │   └── prisma.ts      #   Creates the single PrismaClient instance
        ├── middleware/        # Reusable Express middleware
        │   ├── auth.middleware.ts     # Verifies the JWT and identifies the user
        │   ├── validate.middleware.ts # Validates request bodies with Zod
        │   └── error.middleware.ts    # Central error handler and 404 handler
        ├── utils/             # Small shared helpers
        │   ├── app-error.ts   #   AppError class and status-code helpers
        │   ├── async-handler.ts #  Wraps async handlers to forward errors
        │   ├── jwt.ts         #   Signs and verifies access tokens
        │   └── response.ts    #   Builds the standard success response
        └── modules/           # One folder per feature
            ├── auth/          # Implemented
            │   ├── auth.routes.ts       # URL definitions and middleware order
            │   ├── auth.controller.ts   # Reads the request, sends the response
            │   ├── auth.service.ts      # Business logic and database access
            │   └── auth.validation.ts   # Zod schemas for register and login
            ├── workspace/     # Placeholder
            ├── project/       # Placeholder
            ├── task/          # Placeholder
            ├── chat/          # Placeholder
            ├── whiteboard/    # Placeholder
            ├── github/        # Placeholder
            └── notification/  # Placeholder
```

**Why the code is organised this way:**

- **Feature folders instead of layer folders.** Everything for one feature lives together, so you can read and change a feature in a single folder rather than jumping between separate `controllers/`, `services/`, and `routes/` directories. Adding a feature means adding a new folder that follows the same four-file pattern.
- **`config/` and `utils/` are shared and kept small.** Application-wide concerns (environment, database client, errors) live in one place. Modules import from them but never from each other's internals.
- **The Prisma schema is the single source of truth** for the data model, and migrations are versioned next to it.

A deeper explanation of each folder is in [docs/folder-structure.md](docs/folder-structure.md) and [docs/backend.md](docs/backend.md).

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

## Authentication Flow

DevFlow uses **stateless JWT authentication**. When a user logs in, the server checks their password and returns a signed token. The client stores that token and sends it on later requests in the `Authorization` header as `Bearer <token>`. Because the token itself proves the user's identity, the server does not need to keep any session data.

The diagram below shows what happens during login.

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Express (auth)
    participant V as Zod Validation
    participant DB as PostgreSQL

    C->>A: POST /api/auth/login { email, password }
    A->>V: validate the request body
    V-->>A: parsed, valid input
    A->>DB: find the user by email
    DB-->>A: user record (or none)
    A->>A: bcrypt.compare (runs in constant time)
    A->>A: sign a JWT containing { sub, email }
    A-->>C: 200 { success, data: { user, token } }
```

For a protected route, a middleware checks the token before the request reaches the controller.

```mermaid
flowchart TD
    R["Request with Bearer token"] --> M["authenticate middleware"]
    M --> V{"Is the token valid?"}
    V -->|No| E["401 response via central error handler"]
    V -->|Yes| U["Attach req.user = { id, email }"]
    U --> Ctrl["Controller"]
    Ctrl --> Res["Response"]
```

Key security points: passwords are hashed with bcrypt (cost factor 12); the password hash is never sent to the client because the service selects only safe fields; login runs in constant time to avoid revealing which emails are registered; and the token signing secret is checked to be at least 32 characters when the server starts. The complete write-up is in [docs/authentication.md](docs/authentication.md).

---

## Request Lifecycle

Every request travels through the same stages, and each stage has a single job. This predictability makes the code easy to follow and to test.

```mermaid
flowchart TD
    Client --> Route["Express route"]
    Route --> Validate["Validation (Zod middleware)"]
    Validate --> Controller["Controller — request in, response out"]
    Controller --> Service["Service — business logic"]
    Service --> Prisma["Prisma"]
    Prisma --> DB[("PostgreSQL")]
    DB --> Response["Response { success, data }"]
    Service -.throws error.-> ErrH["Central error handler"]
    ErrH -.-> Response
```

- **Route** — declares the endpoint and the order of middleware.
- **Validation** — rejects invalid input before any logic runs.
- **Controller** — reads the request and shapes the response. It contains no business logic.
- **Service** — holds the business logic and is the only layer that talks to the database.
- **Error handling** — errors are thrown as an `AppError` and formatted in one place, so every error response looks the same.

---

## Getting Started

Follow these steps to run DevFlow on your own machine.

### Requirements

- **Node.js version 20 or newer**, and npm (comes with Node.js)
- **PostgreSQL 14 or newer**, running locally or reachable by a connection URL
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/your-org/devflow.git
cd devflow
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open the new `.env` file and fill in the values. The [Environment Variables](#environment-variables) section explains each one. To generate a strong value for `JWT_SECRET`, run:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Set up the database

From the `backend` folder, apply the database migrations and generate the Prisma client:

```bash
npm run prisma:migrate    # creates the tables in your database
npm run prisma:generate   # generates the type-safe database client
```

### 4. Run the backend

```bash
npm run dev
```

The API starts on `http://localhost:5000`. You can confirm it is running by visiting `http://localhost:5000/health`, which returns `{ "success": true, "data": { "status": "ok" } }`.

### 5. Run the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The web app starts on `http://localhost:3000`.

### Available scripts

| Location | Command | What it does |
|---|---|---|
| backend | `npm run dev` | Starts the dev server with automatic reload |
| backend | `npm run build` | Compiles TypeScript into the `dist/` folder |
| backend | `npm start` | Runs the compiled server (use after `build`) |
| backend | `npm run typecheck` | Checks types without producing output |
| backend | `npm run prisma:migrate` | Creates and applies a database migration |
| backend | `npm run prisma:studio` | Opens Prisma Studio, a visual database browser |
| frontend | `npm run dev` | Starts the Next.js dev server |
| frontend | `npm run build` | Builds the frontend for production |
| frontend | `npm run lint` | Runs the linter |

---

## Environment Variables

The backend reads its configuration from environment variables, defined in a `.env` file. These are validated when the server starts by [config/env.ts](backend/src/config/env.ts). **If a required variable is missing or invalid, the server refuses to start and prints exactly what is wrong.** This prevents hard-to-debug failures later.

| Variable | Description | Required | Example |
|---|---|---|---|
| `NODE_ENV` | The runtime mode | No | `development` |
| `PORT` | The port the backend listens on | No (default `5000`) | `5000` |
| `CORS_ORIGIN` | Allowed frontend origins, comma-separated | No (default `http://localhost:3000`) | `http://localhost:3000` |
| `DATABASE_URL` | The PostgreSQL connection string | **Yes** | `postgresql://user:pass@localhost:5432/devflow` |
| `JWT_SECRET` | The secret used to sign tokens (**at least 32 characters**) | **Yes** | a long random string |
| `JWT_EXPIRES_IN` | How long a token stays valid | No (default `7d`) | `7d` |
| `BCRYPT_SALT_ROUNDS` | The bcrypt cost factor, between 10 and 15 | No (default `12`) | `12` |

> [!WARNING]
> Never commit your `.env` file. It is already listed in `.gitignore`. Use the provided `.env.example` as a template.

---

## API Overview

The API uses REST over JSON, and all routes are grouped under `/api` by module. Every response uses the same structure, so clients can handle success and failure the same way everywhere:

```jsonc
// on success
{ "success": true, "data": { /* the result */ } }

// on error
{ "success": false, "message": "A human-readable reason" }
```

The endpoints available today are:

| Method | Endpoint | Requires token | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Create an account; returns the user and a token |
| `POST` | `/api/auth/login` | No | Sign in; returns the user and a token |
| `GET` | `/api/auth/me` | Yes | Return the currently signed-in user |
| `GET` | `/health` | No | Check that the server is running |

All other module endpoints are **planned**. Endpoint-level documentation will grow in [docs/api.md](docs/api.md) as modules are built. This README intentionally stays at a high level.

---

## Security

The table below separates what is in place now from what is planned.

| Area | In place now | Planned |
|---|---|---|
| Passwords | Hashed with bcrypt (cost 12); never returned to the client | — |
| Tokens (JWT) | Signed with HS256; contain user id and email; secret checked to be at least 32 characters | Refresh tokens, token rotation, logout and revocation |
| Protected routes | `authenticate` middleware verifies the Bearer token | Role-based access control using workspace roles |
| Input validation | Zod validates every request body | Shared validation schemas across modules |
| Transport | Helmet sets security headers; CORS restricted to configured origins | Enforced HTTPS in production |
| Abuse prevention | Rate limiting on `/api/auth` (20 requests per 15 minutes) | Account lockout and per-route limits |
| Secrets | Fail-fast validation at startup; `.env` excluded from version control | Managed secrets in the deployment platform |
| Errors | Central handler; stack traces are hidden in production | Structured logging with request IDs |

The reasoning behind these choices is explained in [docs/authentication.md](docs/authentication.md).

---

## Development Workflow

```mermaid
flowchart LR
    A["Create a feature branch"] --> B["Commit<br/>(Conventional Commits)"]
    B --> C["Open a pull request"]
    C --> D["Review and checks"]
    D --> E["Merge to main"]
    E --> F["Deploy<br/>(Vercel / Render)"]
```

1. Create a branch from `main`, named `feature/<name>`, `fix/<name>`, or `docs/<name>`.
2. Commit using [Conventional Commits](https://www.conventionalcommits.org), for example `feat(auth): add refresh tokens`.
3. Open a pull request. Keep it focused on one change and describe what it does.
4. Make sure the review passes and `npm run typecheck` succeeds.
5. Merge into `main`.

More detail is in [docs/development-workflow.md](docs/development-workflow.md).

---

## Contributing

Contributions are welcome. In short:

- **Branch names:** `feature/...`, `fix/...`, `docs/...`, or `refactor/...`
- **Commit messages:** follow Conventional Commits
- **Code style:** TypeScript strict mode; keep the feature-module layout; put business logic in services and keep controllers thin
- **Before pushing:** run `npm run typecheck` (and tests, once they exist)

The full guide is in [docs/contributing.md](docs/contributing.md), and the coding conventions are in [docs/coding-guidelines.md](docs/coding-guidelines.md).

---

## Roadmap

**Current**

- [x] Project scaffolding (backend and frontend)
- [x] Database schema and migrations (User, Workspace, WorkspaceMember)
- [x] Authentication (register, login, JWT, `/me`)
- [x] Security baseline (Helmet, CORS, rate limiting, environment validation, central error handling)

**Next**

- [ ] Refresh tokens, logout, and role-based access control
- [ ] Workspace module (create, invite, roles)
- [ ] Project and Task modules (Kanban board)
- [ ] Frontend authentication and dashboard screens

**Future**

- [ ] Real-time chat and presence (Socket.IO and Redis)
- [ ] Collaborative whiteboard
- [ ] GitHub integration (sign-in, repository, pull request, and issue sync)
- [ ] Notifications

**Long term**

- [ ] AI assistant (FastAPI, LangChain, and a vector database)
- [ ] Document processing pipeline
- [ ] Video meetings (WebRTC)
- [ ] Horizontal scaling (socket adapter, queues, background workers)

---

## Documentation

| Document | Contents |
|---|---|
| [architecture.md](docs/architecture.md) | System architecture, module boundaries, and the scaling path |
| [system-design.md](docs/system-design.md) | Current and future design: caching, queues, and scaling |
| [backend.md](docs/backend.md) | Backend patterns: controllers, services, and middleware |
| [frontend.md](docs/frontend.md) | Frontend structure and conventions |
| [authentication.md](docs/authentication.md) | Authentication flow, JWT, and security considerations |
| [database.md](docs/database.md) | Prisma schema, relationships, and migrations |
| [api.md](docs/api.md) | API conventions and endpoints |
| [folder-structure.md](docs/folder-structure.md) | Folder layout and the reasoning behind it |
| [deployment.md](docs/deployment.md) | Deploying to Vercel and Render |
| [development-workflow.md](docs/development-workflow.md) | Branching, commits, and pull requests |
| [coding-guidelines.md](docs/coding-guidelines.md) | Code style and conventions |
| [contributing.md](docs/contributing.md) | How to contribute |
| [roadmap.md](docs/roadmap.md) | Detailed roadmap |
| [future-features.md](docs/future-features.md) | Planned features in depth |
| [vision.md](docs/vision.md) | Product vision |

> [!NOTE]
> The `docs/` set is being written. Some links above point to files that are still in progress. Existing documents are being upgraded to this standard rather than replaced.

---

## License

Released under the **MIT License**. See [LICENSE](LICENSE).

---

## Acknowledgements

DevFlow is built with the work of the open-source community, including [Express](https://expressjs.com), [Prisma](https://www.prisma.io), [Next.js](https://nextjs.org), [Zod](https://zod.dev), and [Socket.IO](https://socket.io).

The documentation structure is inspired by mature open-source projects such as Prisma, Supabase, and Cal.com.
