# API Reference

> The conventions every DevFlow endpoint follows, and the endpoints available today.
> Related: [backend.md](backend.md) · [authentication.md](authentication.md) · [workspace.md](workspace.md) · [architecture.md](architecture.md)

---

## Purpose

This document defines how the DevFlow HTTP API behaves: its base path, response format, status codes, and error shape. These conventions are shared by every module, so once you know them you can predict how any endpoint responds. Detailed per-endpoint documentation grows here as modules are built.

---

## Overview

- **Style:** REST over HTTP, with JSON request and response bodies.
- **Base path:** all module routes are mounted under `/api`.
- **Content type:** `application/json`. Request bodies are limited to 1 MB.
- **Authentication:** a Bearer token in the `Authorization` header for protected routes (see [authentication.md](authentication.md)).

> [!IMPORTANT]
> Implemented today: the **authentication** and **workspace** modules, plus a health check. Every endpoint listed under [Planned Endpoints](#planned-endpoints) is not yet implemented.

---

## Response Format

Every response uses one of two shapes, so a client can handle all endpoints the same way.

**Success:**

```json
{
  "success": true,
  "data": { }
}
```

**Error:**

```json
{
  "success": false,
  "message": "A human-readable reason"
}
```

**Validation error** (adds a per-field breakdown):

```json
{
  "success": false,
  "errors": {
    "email": ["A valid email is required"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

The success envelope is produced by the `sendSuccess` helper; error envelopes are produced centrally by the error handler (see [backend.md](backend.md#error-handling)).

---

## Status Codes

| Code | Meaning | When DevFlow uses it |
|---|---|---|
| `200 OK` | Success | Successful login, `/me`, general reads |
| `201 Created` | Resource created | Successful registration |
| `400 Bad Request` | Invalid input | Zod validation failure |
| `401 Unauthorized` | Not authenticated | Missing/invalid token, wrong credentials |
| `403 Forbidden` | Authenticated but not allowed | Not a workspace member, or role too low for the action |
| `404 Not Found` | No such route or resource | Unknown route, missing/soft-deleted record |
| `409 Conflict` | Conflicts with existing state | Duplicate email on register, or user already a member |
| `429 Too Many Requests` | Rate limit exceeded | Too many auth requests |
| `500 Internal Server Error` | Unexpected error | Uncaught/unexpected failure (details hidden) |

---

## Authentication

Protected routes require a header:

```http
Authorization: Bearer <token>
```

A token is obtained from `/api/auth/register` or `/api/auth/login`. It expires after `JWT_EXPIRES_IN` (default 7 days), after which the client must log in again.

---

## Available Endpoints

### System

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | Liveness check. Returns `{ status: "ok" }` |

### Auth — `/api/auth`

#### `POST /api/auth/register`

Create an account and receive a token.

**Request**

```json
{ "name": "Ada Lovelace", "email": "ada@example.com", "password": "a-strong-password" }
```

**Response — 201**

```json
{
  "success": true,
  "data": {
    "user": { "id": "clx...", "name": "Ada Lovelace", "email": "ada@example.com" },
    "token": "eyJhbGciOi..."
  }
}
```

Errors: `400` invalid input, `409` email already registered.

#### `POST /api/auth/login`

Authenticate and receive a token.

**Request**

```json
{ "email": "ada@example.com", "password": "a-strong-password" }
```

**Response — 200**

```json
{
  "success": true,
  "data": {
    "user": { "id": "clx...", "name": "Ada Lovelace", "email": "ada@example.com" },
    "token": "eyJhbGciOi..."
  }
}
```

Errors: `400` invalid input, `401` invalid email or password.

#### `GET /api/auth/me`

Return the currently authenticated user. Requires a Bearer token.

**Response — 200**

```json
{
  "success": true,
  "data": {
    "user": { "id": "clx...", "name": "Ada Lovelace", "email": "ada@example.com" }
  }
}
```

Errors: `401` missing/invalid/expired token.

> [!NOTE]
> The user object never includes `passwordHash` or `refreshToken`. See [authentication.md](authentication.md#preventing-password-hash-leakage).

### Workspaces — `/api/workspaces`

All workspace routes require a Bearer token. Routes with an `:id` are workspace-scoped: the caller must be a member, and some actions require a minimum role. Authorization is enforced by the `authorize(...)` middleware; see [workspace.md](workspace.md) for the full model.

| Method | Path | Min. role | Description |
|---|---|---|---|
| `POST` | `/api/workspaces` | any user | Create a workspace; caller becomes `OWNER` |
| `GET` | `/api/workspaces` | any user | List the workspaces the caller belongs to |
| `GET` | `/api/workspaces/:id` | member | Get one workspace (includes caller's role) |
| `PATCH` | `/api/workspaces/:id` | `OWNER`/`ADMIN` | Rename / update description |
| `DELETE` | `/api/workspaces/:id` | `OWNER` | Soft-delete the workspace |
| `POST` | `/api/workspaces/:id/invite` | `OWNER`/`ADMIN` | Add an existing user by email |
| `GET` | `/api/workspaces/:id/members` | member | List members |
| `PATCH` | `/api/workspaces/:id/members/:memberId` | `OWNER`/`ADMIN` | Change a member's role |
| `DELETE` | `/api/workspaces/:id/members/:memberId` | `OWNER`/`ADMIN` | Remove a member |
| `POST` | `/api/workspaces/:id/leave` | member | Leave the workspace |

#### `POST /api/workspaces`

**Request**

```json
{ "name": "Alpha Team", "description": "Our workspace" }
```

**Response — 201**

```json
{
  "success": true,
  "data": {
    "workspace": {
      "id": "cmrnij54...",
      "name": "Alpha Team",
      "description": "Our workspace",
      "ownerId": "cmrnij3m...",
      "createdAt": "2026-07-16T12:56:21.397Z",
      "updatedAt": "2026-07-16T12:56:21.397Z",
      "deletedAt": null
    }
  }
}
```

Errors: `400` invalid input, `401` no token.

#### `POST /api/workspaces/:id/invite`

Adds an already-registered user to the workspace by email. No email is sent. `role` defaults to `MEMBER`; only `ADMIN`/`MEMBER` are assignable.

**Request**

```json
{ "email": "member@example.com", "role": "MEMBER" }
```

**Response — 201**

```json
{
  "success": true,
  "data": {
    "member": {
      "id": "cmrnij5s...",
      "role": "MEMBER",
      "joinedAt": "2026-07-16T12:56:22.287Z",
      "user": { "id": "cmrnij4n...", "name": "Member User", "email": "member@example.com", "avatar": null }
    }
  }
}
```

Errors: `400` invalid input, `403` caller is not `OWNER`/`ADMIN`, `404` no user with that email or workspace not found, `409` user already a member.

> [!NOTE]
> A runnable Postman collection covering every workspace endpoint and its error cases lives at `backend/postman/devflow-workspace.postman_collection.json`.

### Projects — `/api/projects`

Projects belong to a workspace. All routes require a Bearer token and workspace membership. On create and list the workspace is named in the request (body/query); on `:id` routes it is derived from the project. Authorization is enforced by the project guards (see [workspace.md](workspace.md#authorization-model) for the shared role model).

| Method | Path | Min. role | Description |
|---|---|---|---|
| `POST` | `/api/projects` | `OWNER`/`ADMIN` | Create a project (`workspaceId` in body) |
| `GET` | `/api/projects?workspaceId=...` | member | List active projects in a workspace |
| `GET` | `/api/projects/:id` | member | Get one project |
| `PATCH` | `/api/projects/:id` | `OWNER`/`ADMIN` | Update title/description/status/color |
| `DELETE` | `/api/projects/:id` | `OWNER`/`ADMIN` | Soft-delete the project |

#### `POST /api/projects`

**Request**

```json
{ "workspaceId": "cmrnju11...", "title": "Roadmap", "description": "Q3 plan", "status": "ACTIVE", "color": "#2D9CDB" }
```

`status` is one of `ACTIVE` (default), `ARCHIVED`, `COMPLETED`. `color` is an optional `#rrggbb` hex value.

**Response — 201**

```json
{
  "success": true,
  "data": {
    "project": {
      "id": "cmrnju1c...",
      "workspaceId": "cmrnju11...",
      "title": "Roadmap",
      "description": "Q3 plan",
      "status": "ACTIVE",
      "color": "#2D9CDB",
      "createdBy": "cmrnjtza...",
      "createdAt": "2026-07-16T13:32:49.359Z",
      "updatedAt": "2026-07-16T13:32:49.359Z",
      "deletedAt": null
    }
  }
}
```

Errors: `400` invalid input or missing `workspaceId`, `403` caller is not `OWNER`/`ADMIN`, `404` workspace not found.

> [!NOTE]
> A runnable Postman collection for the project module lives at `backend/postman/devflow-project.postman_collection.json`.

---

## Planned Endpoints

These reflect the [roadmap](roadmap.md) and are not implemented. Paths are indicative and may change.

| Area | Example endpoints |
|---|---|
| Auth | `POST /api/auth/refresh`, `POST /api/auth/logout`, `POST /api/auth/forgot-password` |
| Tasks | `POST /api/tasks`, `PATCH /api/tasks/:id`, `GET /api/projects/:id/tasks` |
| Chat | `GET /api/workspaces/:id/messages` (plus Socket.IO events) |
| Notifications | `GET /api/notifications`, `PATCH /api/notifications/:id/read` |
| GitHub | `GET /api/github/repos`, `POST /api/github/connect` |

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Response shape | One `{ success, data }` envelope | Clients handle every endpoint uniformly |
| Errors | Central handler, safe messages | Consistent, no leaked internals |
| Validation errors | Per-field `errors` object | Clients can show messages next to fields |
| Auth transport | Bearer token header | Standard, stateless |
| Versioning | Not yet | Add `/api/v1` only when a breaking change is needed |

---

## Best Practices

- Return `sendSuccess(res, data, status)` from controllers rather than building responses by hand.
- Use the correct status code; do not return `200` with an error inside.
- Throw an `AppError` for expected failures so the response shape stays consistent.
- Keep endpoint documentation in this file up to date as modules ship.

---

## Developer Notes

- There is no API versioning yet. If a breaking change is unavoidable before clients depend on the API, introduce `/api/v1`.
- Realtime features (chat, whiteboard) will use Socket.IO events rather than REST; those will be documented separately once built.
- A machine-readable OpenAPI specification is a planned improvement (see [future-features.md](future-features.md)).

---

_Next: [folder-structure.md](folder-structure.md) — the repository layout in detail._
