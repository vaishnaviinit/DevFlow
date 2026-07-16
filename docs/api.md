# API Reference

> The conventions every DevFlow endpoint follows, and the endpoints available today.
> Related: [backend.md](backend.md) · [authentication.md](authentication.md) · [architecture.md](architecture.md)

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
> Only the authentication endpoints and a health check exist today. Every other endpoint listed under [Planned Endpoints](#planned-endpoints) is not yet implemented.

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
| `403 Forbidden` | Authenticated but not allowed | Reserved for role checks (planned) |
| `404 Not Found` | No such route or resource | Unknown route, missing record |
| `409 Conflict` | Conflicts with existing state | Registering an email that already exists |
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

---

## Planned Endpoints

These reflect the [roadmap](roadmap.md) and are not implemented. Paths are indicative and may change.

| Area | Example endpoints |
|---|---|
| Auth | `POST /api/auth/refresh`, `POST /api/auth/logout`, `POST /api/auth/forgot-password` |
| Workspaces | `POST /api/workspaces`, `GET /api/workspaces`, `POST /api/workspaces/:id/members` |
| Projects | `POST /api/projects`, `GET /api/workspaces/:id/projects` |
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
