# Contributing

> How to set up the project, make a change, and get it merged.
> Related: [development-workflow.md](development-workflow.md) · [coding-guidelines.md](coding-guidelines.md) · [backend.md](backend.md)

---

## Purpose

This guide helps a new contributor go from cloning the repository to opening a good pull request. It gathers the practical steps and links to the deeper documents where relevant.

---

## Before You Start

- DevFlow is in early development. Only the authentication module works; most modules are placeholders. Check the [roadmap](roadmap.md) and [project status](../README.md#project-status) so your work fits what is planned.
- Read [coding-guidelines.md](coding-guidelines.md) and skim [backend.md](backend.md) to learn the patterns.

---

## Local Setup

Full instructions are in the [README](../README.md#getting-started). In short:

```bash
git clone https://github.com/your-org/devflow.git
cd devflow/backend
npm install
cp .env.example .env        # fill in the values
npm run prisma:migrate
npm run dev                 # backend on http://localhost:5000
```

```bash
cd ../frontend
npm install
npm run dev                 # frontend on http://localhost:3000
```

---

## Making a Change

1. **Create a branch** from `main` using the right prefix: `feature/`, `fix/`, `refactor/`, `docs/`, or `chore/`. See [development-workflow.md](development-workflow.md#branching).
2. **Make the change**, following the module patterns in [backend.md](backend.md) and the conventions in [coding-guidelines.md](coding-guidelines.md).
3. **Add or update documentation** if behaviour or setup changes.
4. **Run checks:**
   ```bash
   npm run typecheck
   ```
5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org), for example `feat(workspace): add member invites`.

---

## Adding a New Module

Follow the recipe in [backend.md](backend.md#adding-a-new-module):

1. Create `src/modules/<name>/` with `routes`, `controller`, `service`, and `validation` files.
2. Define Zod schemas and infer their types.
3. Put logic in the service; keep the controller thin.
4. Throw `AppError` for expected failures.
5. Mount the router in `index.ts` after the global middleware and before the error handler.

Do not import another module's internal files; share through a service function.

---

## Pull Requests

- Open the PR against `main` with a clear description of **what** and **why**.
- Keep it focused on one concern; split large changes.
- Ensure typecheck passes and no secrets are committed.
- Respond to review comments and update the branch.

See [development-workflow.md](development-workflow.md#pull-requests) for the full flow.

---

## What Makes a Good Contribution

- Follows the existing patterns instead of introducing a new style.
- Is small and focused enough to review easily.
- Keeps controllers thin and logic in services.
- Does not weaken security (see [authentication.md](authentication.md)).
- Updates docs when it changes behaviour or setup.

---

## Reporting Issues

When opening an issue, include:

- What you expected to happen and what actually happened.
- Steps to reproduce.
- Relevant logs or error messages (with secrets removed).
- Your environment (Node version, OS) if relevant.

---

## Code of Conduct

Be respectful and constructive in issues, reviews, and discussions. Assume good intent, and give feedback on the code, not the person.

---

## Developer Notes

- There is no CI pipeline yet, so run `npm run typecheck` yourself before opening a PR.
- There are no automated tests yet; adding them is welcome and is a listed priority ([backend.md](backend.md#future-improvements)).
- Replace `your-org/devflow` in the clone URL with the real repository path once it is published.

---

_Next: [roadmap.md](roadmap.md) — what is planned and in what order._
