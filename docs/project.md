# Project Module

> Projects belong to a workspace and reuse the workspace role model for access control.
> Related: [workspace.md](workspace.md) · [backend.md](backend.md) · [database.md](database.md) · [api.md](api.md)

---

## Purpose

This document describes the project module: what a project is, how it is authorized, and the decisions behind it. It builds directly on the workspace module — a project always lives inside a workspace, and permissions come from the caller's role in that workspace.

---

## Overview

A **project** organises work inside a workspace. It has a title, an optional description, a status, an optional colour, and records who created it. Projects are soft-deleted.

| Field | Type | Notes |
|---|---|---|
| `title` | string | 2–120 chars |
| `description` | string? | up to 1000 chars |
| `status` | enum | `ACTIVE` (default), `ARCHIVED`, `COMPLETED` |
| `color` | string? | `#rrggbb` hex |
| `createdBy` | string | user id of the creator |
| `workspaceId` | string | owning workspace |
| `deletedAt` | datetime? | soft-delete marker |

The model is in [database.md](database.md#current-schema).

---

## Endpoints

All routes require authentication and workspace membership.

| Method | Path | Min. role | Workspace resolved from |
|---|---|---|---|
| `POST` | `/api/projects` | `OWNER`/`ADMIN` | `body.workspaceId` |
| `GET` | `/api/projects?workspaceId=...` | member | `query.workspaceId` |
| `GET` | `/api/projects/:id` | member | the project |
| `PATCH` | `/api/projects/:id` | `OWNER`/`ADMIN` | the project |
| `DELETE` | `/api/projects/:id` | `OWNER`/`ADMIN` | the project |

Request/response shapes are in [api.md](api.md#projects--apiprojects).

---

## Architecture

Standard layering (`routes -> middleware -> controller -> service -> Prisma`). The one thing specific to projects is **how the workspace is resolved for authorization**, because projects are a nested resource and the workspace is not always in the path.

```mermaid
flowchart TD
    subgraph Create/List
      A1["Route"] --> A2["authenticate"]
      A2 --> A3["authorizeWorkspaceScope(...roles)<br/>reads workspaceId from body/query"]
    end
    subgraph Item routes (:id)
      B1["Route"] --> B2["authenticate"]
      B2 --> B3["authorizeProject(...roles)<br/>loads project -> workspaceId"]
    end
    A3 --> G["loadMembership(workspaceId, user)<br/>+ role check"]
    B3 --> G
    G --> C["Controller -> Service -> Prisma"]
```

Files:

| File | Responsibility |
|---|---|
| `project.routes.ts` | Endpoints + middleware chain |
| `project.middleware.ts` | `authorizeWorkspaceScope` and `authorizeProject` guards, `ProjectRequest` type |
| `project.controller.ts` | Thin handlers using `req.workspace` / `req.project` |
| `project.service.ts` | CRUD and Prisma access |
| `project.validation.ts` | Zod schemas and inferred types |

---

## Authorization Model

Projects reuse the workspace role model. There is no separate project role — a member's permissions on a project come from their role in the project's workspace.

The two guards both end in the same check, reusing the workspace module's `loadMembership` (one implementation of "resolve workspace + caller role"):

- **`authorizeWorkspaceScope(...roles)`** — for `POST /projects` and `GET /projects`. Reads `workspaceId` from the body or query, resolves membership, checks the role, and attaches `req.workspace` and `req.membership`. Returns `400` if `workspaceId` is missing.
- **`authorizeProject(...roles)`** — for `/projects/:id`. Loads the active project, derives its `workspaceId`, then does the same membership and role check, and additionally attaches `req.project`.

> [!IMPORTANT]
> As in the workspace module, roles are checked only in middleware. The service performs no authorization — it trusts the guard and focuses on persistence. Controllers read `req.workspace` / `req.project` and never re-query or re-check.

Errors are consistent with the rest of the API: `401` no token, `403` not a member or role too low, `404` workspace/project not found or soft-deleted, `400` invalid input.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Role source | Workspace membership | One role model; a project inherits its workspace's roles |
| Workspace resolution | Body/query on create/list, project on `:id` | Flat `/projects` routes without a workspace in the path |
| Authorization location | Two guards reusing `loadMembership` | Single membership implementation; no checks in services/controllers |
| Delete | Soft (`deletedAt`) | Consistent with workspaces; reversible |
| Colour | Optional `#rrggbb` | Simple, validated, UI-friendly |
| Create/update roles | `OWNER`/`ADMIN`; read: any member | Matches the spec: members read, managers write |

---

## Tradeoffs

- **Flat routes (`/projects`) need the workspace passed in.** This keeps the URL simple but means create/list validate a `workspaceId` input rather than reading it from the path. The `authorizeWorkspaceScope` guard centralises that.
- **No project-level roles.** Fine for now; if per-project permissions are ever needed, they would be added on top of workspace roles.

---

## Scalability

- The `@@index([workspaceId])` on `Project` keeps "list projects in a workspace" efficient.
- The module is the template for the next nested resource: **tasks** will belong to a project and resolve their workspace through the project, reusing the same guard pattern.

---

## Testing

Verified end to end against a running server — creation with status/colour, RBAC by role and by membership (member and outsider blocked), workspace-from-body vs workspace-from-project resolution, validation, and soft delete (20 cases). A runnable Postman collection is provided:

```bash
newman run backend/postman/devflow-project.postman_collection.json
```

---

## Best Practices

- Put role checks in the route's guard, never in the controller or service.
- Read `req.workspace` and `req.project` in controllers instead of re-querying.
- Filter `deletedAt: null` on every project read.
- Keep the workspace-resolution logic in the guards so handlers stay uniform.

---

## Developer Notes

- `ProjectRequest` (from `project.middleware.ts`) extends `WorkspaceRequest` and adds `project`, guaranteed present on `:id` routes.
- `createBy` is taken from the authenticated user, never from the request body.
- Task management (Part 5) will nest under projects and follow this same pattern.

---

_Next: the Task module — tasks belong to a project and reuse this access model._
