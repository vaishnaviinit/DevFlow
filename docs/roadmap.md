# Roadmap

> What is built, what is being built next, and what comes later.
> Related: [future-features.md](future-features.md) · [vision.md](vision.md) · [README](../README.md#project-status)

---

## Purpose

This document tracks the direction of DevFlow at a glance. It is honest about the current state: only authentication is implemented. Everything else is planned. Detailed descriptions of planned features are in [future-features.md](future-features.md).

> [!NOTE]
> Checked items are done. Unchecked items are planned and not yet built. The order within each stage is a guide, not a contract.

---

## Current

Done and working today.

- [x] Backend and frontend project scaffolding
- [x] PostgreSQL and Prisma set up with migrations
- [x] Data models: `User`, `Workspace`, `WorkspaceMember`
- [x] Authentication: registration, login, JWT, protected `/me`
- [x] Password hashing (bcrypt), input validation (Zod)
- [x] Security baseline: Helmet, CORS, rate limiting on auth
- [x] Fail-fast environment validation
- [x] Central error handling and a standard response format
- [x] Documentation set (this `docs/` folder)
- [x] Role-based access control (`authorize()` middleware, workspace-scoped)
- [x] Workspace module: create, update, soft-delete, invite members, manage roles, leave
- [x] Project module: create, list, get, update, soft-delete (workspace-scoped, RBAC)
- [x] Postman collections for the workspace and project modules

---

## Next

The immediate focus: build the remaining core collaboration features and complete authentication.

- [ ] Task module: tasks with status, priority, assignee, and due date (Kanban)
- [ ] Refresh tokens and token rotation
- [ ] Logout and token revocation
- [ ] Ownership transfer for workspaces
- [ ] Frontend: authentication screens and a dashboard shell

---

## Future

Bigger features that build on the core.

- [ ] Real-time chat with presence and typing indicators (Socket.IO)
- [ ] Redis for caching, shared rate limiting, and socket scaling
- [ ] Collaborative whiteboard with real-time multi-user editing
- [ ] GitHub integration: sign-in, repository, pull request, and issue sync
- [ ] Notifications: in-app feed with read state and delivery
- [ ] Background workers for email, GitHub sync, and notifications

---

## Long Term

Larger efforts, taken on after the core platform is solid.

- [ ] AI assistant: a FastAPI service with LangChain and a vector database
- [ ] Document processing pipeline for AI retrieval
- [ ] Video meetings (WebRTC)
- [ ] Object storage for file uploads
- [ ] Horizontal scaling: multiple instances, read replicas, queues
- [ ] Automated tests and a CI pipeline
- [ ] Containerised deployment (Docker) and staging environment

---

## How This Maps to the Architecture

The order above follows the scaling and design plan rather than jumping ahead:

- Core modules (workspace, project, task) come before realtime, because they define the data that realtime updates.
- Redis arrives alongside the first feature that truly needs shared state (chat/presence), not before.
- The AI service is deliberately last and separate, because it is a different language and runtime (see [architecture.md](architecture.md#future-microservices)).

---

## Developer Notes

- This roadmap is a living document; update it as items move between stages.
- Reserved schema fields already hint at what is next: `refreshToken` on `User` and the `WorkspaceRole` enum both support the "Next" stage.
- For the reasoning and detail behind each planned item, see [future-features.md](future-features.md).

---

_Next: [future-features.md](future-features.md) — planned features in depth._
