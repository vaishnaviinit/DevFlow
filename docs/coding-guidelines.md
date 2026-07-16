# Coding Guidelines

> The conventions that keep DevFlow's code consistent: naming, structure, types, and patterns.
> Related: [backend.md](backend.md) · [folder-structure.md](folder-structure.md) · [development-workflow.md](development-workflow.md)

---

## Purpose

Consistent code is easier to read, review, and change. This document sets the conventions everyone follows so the codebase reads as if one person wrote it. When in doubt, match the style of the existing auth module.

---

## Language and Tooling

- **TypeScript** in `strict` mode for both backend and frontend.
- **ESLint** for linting.
- Prefer clear, explicit code over clever code.

---

## Naming

| Item | Convention | Example |
|---|---|---|
| Module folders | lowercase, singular | `auth`, `project` |
| Backend files | `kebab-case` with role suffix | `auth.service.ts`, `app-error.ts` |
| React components | `PascalCase` | `TaskCard.tsx` |
| Variables, functions | `camelCase` | `registerUser` |
| Types, interfaces | `PascalCase` | `RegisterInput` |
| Constants | `UPPER_SNAKE_CASE` | `BCRYPT_SALT_ROUNDS` |
| Booleans | `is`/`has`/`should` prefix | `isActive`, `hasAccess` |

Name things by what they mean, not by their type. `users` is better than `userArray`.

---

## TypeScript

- **Avoid `any`.** If a type is unknown, use `unknown` and narrow it. The old auth code used `catch (error: any)`; the refactor removed it.
- **Derive types from schemas.** Use `z.infer` so validation and types cannot drift (see [backend.md](backend.md#validation)).
- **Type function inputs and public return values.** Let TypeScript infer local variables.
- **Prefer `interface` for object shapes** and `type` for unions and utilities.
- **No unsafe casts.** Narrow with checks instead of asserting with `as` where possible; the one accepted cast is the JWT `expiresIn` option, isolated in `utils/jwt.ts`.

---

## Backend Patterns

These are covered in depth in [backend.md](backend.md); the rules in short:

- **Controllers are thin.** Read the request, call a service, send the response. No business logic.
- **Services hold logic and own database access.** They are the only layer that uses Prisma.
- **Throw, do not respond, on error.** Throw an `AppError`; let the central handler format it.
- **Validate at the edge.** Every request body goes through a Zod schema before the controller.
- **Read config from `env`,** never from `process.env` directly.
- **Do not cross module boundaries.** Share logic through a service function, not by importing another module's files.

```typescript
// Good: thin controller, logic in the service, error thrown not sent
export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  sendSuccess(res, result);
});
```

---

## Error Handling

- Throw `AppError` (or a factory like `Conflict`, `Unauthorized`) for expected failures.
- Never send raw error messages or stack traces to the client.
- Let unexpected errors reach the central handler, which returns a generic `500`.

---

## Formatting

- Use the project's ESLint configuration; do not fight it.
- Keep functions short and focused; if a function does several things, split it.
- Avoid deep nesting; return early instead.
- No commented-out code and no dead code in commits.

---

## Magic Values

Avoid unexplained literals. Give them a name or read them from config.

```typescript
// Avoid
await bcrypt.hash(password, 10);

// Prefer
await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
```

---

## Comments

- Explain **why**, not **what**. The code already says what it does.
- Comment non-obvious decisions (for example, the dummy-hash comparison in login exists to prevent a timing attack).
- Keep comments up to date; a wrong comment is worse than none.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Strictness | `strict` TypeScript | Catches errors before runtime |
| Types from schemas | `z.infer` | One source of truth for shape |
| Error style | Throw `AppError` | Consistent responses |
| File naming | Role-suffixed kebab-case | Predictable and searchable |

---

## Best Practices

- Match the existing module's style before inventing a new one.
- Prefer explicit and readable over short and clever.
- Keep controllers thin and services pure of HTTP concerns.
- Name booleans and functions so their purpose is obvious.
- Remove dead code rather than commenting it out.

---

## Developer Notes

- The auth module is the reference implementation; copy its shape for new modules.
- There is no Prettier config committed yet; follow ESLint and the surrounding style.
- Tests are not set up yet; when they are, name test files next to the code they cover and follow the `test:` commit type.

---

_Next: [contributing.md](contributing.md) — how to contribute._
