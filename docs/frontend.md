# Frontend

> The DevFlow web application: its stack, structure, and the conventions it will follow as screens are built.
> Related: [architecture.md](architecture.md) · [api.md](api.md) · [folder-structure.md](folder-structure.md)

---

## Purpose

This document describes the frontend application and the conventions for building it. It is deliberately forward-looking, because the frontend is at an early stage.

> [!IMPORTANT]
> The frontend is currently the **default Next.js starter**. It has no product screens, no authentication UI, and no connection to the backend yet. This document records the stack and the intended structure so that work can begin consistently.

---

## Overview

- **Framework:** Next.js 16 using the App Router.
- **Library:** React 19.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS 4.

The App Router organises the application by folders under `src/app/`, where each folder is a route and special files (`layout.tsx`, `page.tsx`) define layout and page content.

> [!WARNING]
> This project uses a recent version of Next.js whose APIs and conventions may differ from older tutorials and from prior knowledge. The repository includes an `AGENTS.md` note reminding contributors to check the installed version's documentation before writing code. When in doubt, follow the version in `frontend/package.json`.

---

## Current Structure

```text
frontend/
├── src/
│   └── app/
│       ├── layout.tsx     # Root layout wrapping every page
│       ├── page.tsx       # Home page (currently the starter page)
│       └── globals.css    # Global styles and Tailwind directives
├── public/                # Static assets (icons, images)
├── next.config.ts         # Next.js configuration
├── tsconfig.json
└── package.json
```

---

## Planned Structure

As the application grows, a conventional App Router layout is expected. This is a proposal, not yet built.

```text
src/
├── app/
│   ├── (auth)/            # Login and register routes
│   ├── (dashboard)/       # Authenticated app routes
│   │   └── workspaces/
│   ├── layout.tsx
│   └── page.tsx
├── components/            # Reusable UI components
├── lib/                   # API client, helpers
├── hooks/                 # Reusable React hooks
└── types/                 # Shared TypeScript types
```

| Folder | Purpose |
|---|---|
| `app/` | Routes, layouts, and pages (App Router) |
| `components/` | Reusable presentational and UI components |
| `lib/` | The API client and shared utilities |
| `hooks/` | Custom React hooks |
| `types/` | Shared types, ideally aligned with the API |

---

## Talking to the Backend

The frontend will call the backend's REST API (see [api.md](api.md)). The key points that shape frontend code:

- Every response is `{ success, data }` or `{ success: false, message }`, so a single API-client wrapper can unwrap `data` and throw on `success: false`.
- Protected requests send `Authorization: Bearer <token>`; the token comes from login and must be stored and attached to requests.
- Validation errors return a per-field `errors` object, which maps naturally onto form field errors.

> [!TIP]
> Centralise API calls in one `lib/api` module rather than calling `fetch` from components. That gives one place to attach the token, handle the response envelope, and manage errors.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js App Router | Modern routing, server components, good defaults |
| Styling | Tailwind CSS | Fast, consistent styling without separate CSS files |
| Language | TypeScript | Shared discipline with the backend; fewer runtime errors |
| API access | One central client (planned) | Single place for tokens, envelope, and errors |

---

## Tradeoffs

- **App Router** is powerful but newer; some patterns differ from the older Pages Router. Follow the installed version's docs.
- **Tailwind** keeps styles close to markup, which some find verbose; the consistency and speed are worth it for a small team.

---

## Future Improvements

- Authentication screens (login, register) wired to the backend.
- A dashboard shell and workspace screens.
- A shared UI component set and design tokens.
- State/data-fetching approach (for example, React Query) once there is data to fetch.
- Shared types generated from or aligned with the API.

---

## Best Practices

- Keep pages thin; put reusable logic in components, hooks, and `lib/`.
- Do not call `fetch` directly from components; go through the central API client.
- Type API responses; do not use `any`.
- Follow the naming conventions in [coding-guidelines.md](coding-guidelines.md) (`PascalCase` components, `camelCase` functions).

---

## Developer Notes

- Run the frontend with `npm run dev` from the `frontend/` folder; it serves on `http://localhost:3000`.
- The backend's `CORS_ORIGIN` defaults to `http://localhost:3000`, so local development works without extra configuration.
- Check `frontend/package.json` for the exact Next.js and React versions before relying on any API.

---

_Next: [deployment.md](deployment.md) — deploying the frontend and backend._
