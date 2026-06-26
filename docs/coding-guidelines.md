# Aether — Coding Guidelines

## Naming Conventions

### Folders

- Always `kebab-case`.
- Examples: `data-display/`, `schedule-block/`, `recurring-task/`.
- Never PascalCase or camelCase for folder names.

### Files

| Category | Convention | Example |
|---|---|---|
| React components | PascalCase | `TaskCard.tsx`, `Sidebar.tsx` |
| Hooks | camelCase with `use` prefix | `useTasks.ts`, `useDebounce.ts` |
| Services | camelCase with `.service` suffix | `task.service.ts`, `auth.service.ts` |
| Controllers | camelCase with `.controller` suffix | `task.controller.ts` |
| Repositories | camelCase with `.repository` suffix | `task.repository.ts` |
| Validators | camelCase with `.validator` suffix | `task.validator.ts` |
| Routes | camelCase with `.routes` suffix | `task.routes.ts` |
| Middleware | camelCase with `.middleware` suffix | `auth.middleware.ts` |
| Types | camelCase with `.types` suffix or domain name | `auth.types.ts`, `task.ts` |
| Utilities | camelCase | `date.ts`, `format.ts`, `pagination.ts` |
| Configuration | camelCase | `env.ts`, `prisma.ts` |
| Tests | Same as source file with `.test` suffix | `task.service.test.ts` |

### Components

- React components are always PascalCase.
- One component per file. The file name matches the component name.
- Named exports only. No default exports for components.

```typescript
export function TaskCard({ task }: TaskCardProps) { ... }
```

### Variables and Functions

- camelCase for all variables and functions.
- Boolean variables start with `is`, `has`, `can`, or `should`.
- Functions that return booleans start with `is`, `has`, `can`, or `should`.
- Event handlers start with `handle` in components and `on` in props.

```typescript
const isCompleted = task.status === "COMPLETED";
const hasSubtasks = task.subtasks.length > 0;

function handleTaskClick() { ... }
<TaskCard onClick={handleTaskClick} />

interface TaskCardProps {
  onComplete: (taskId: string) => void;
}
```

### Constants

- UPPER_SNAKE_CASE for true constants.
- camelCase for configuration-like constants.

```typescript
const MAX_TASKS_PER_PAGE = 100;
const DEFAULT_PAGE_SIZE = 20;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Types and Interfaces

- PascalCase for all types and interfaces.
- No `I` prefix on interfaces.
- Suffix with the kind of type when helpful: `Props`, `Input`, `Output`, `Filters`.

```typescript
interface TaskCardProps { ... }
interface CreateTaskInput { ... }
interface TaskFilters { ... }
type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
```

### Enums

- PascalCase for enum names.
- UPPER_SNAKE_CASE for enum values.

```typescript
enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
```

### API Routes

- Lowercase with hyphens for multi-word resources.
- Plural nouns for collections.
- Never use verbs in URLs (use HTTP methods instead).

```
GET    /api/v1/tasks
POST   /api/v1/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id/status
GET    /api/v1/daily-plans/today
POST   /api/v1/schedule-blocks
```

### Database

- Tables: PascalCase (Prisma convention).
- Columns: camelCase (Prisma convention).
- Enums: PascalCase names, UPPER_SNAKE_CASE values.

---

## Git Conventions

### Commit Messages

Follow the Conventional Commits specification:

```
<type>(<scope>): <description>

<optional body>
```

#### Types

| Type | When to use |
|---|---|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `refactor` | Restructuring code without changing behavior |
| `docs` | Documentation changes only |
| `style` | Formatting, semicolons, whitespace (not CSS changes) |
| `test` | Adding or updating tests |
| `chore` | Tooling, dependencies, config changes |
| `perf` | Performance improvements |

#### Scopes

| Scope | Meaning |
|---|---|
| `frontend` | Changes to the frontend project |
| `backend` | Changes to the backend project |
| `db` | Database schema or migration changes |
| `api` | API contract changes |
| `config` | Configuration file changes |
| `docs` | Documentation |
| `init` | Project initialization |

#### Examples

```
feat(backend): add task CRUD service and repository
fix(frontend): resolve sidebar collapse animation jitter
refactor(backend): extract pagination logic into shared utility
docs(api): document scheduling endpoints
chore(config): update eslint rules for consistent imports
```

### Branch Naming

```
<type>/<short-description>
```

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Always deployable. |
| `feat/task-crud` | Feature branch for task CRUD |
| `fix/sidebar-animation` | Bug fix branch |
| `refactor/auth-middleware` | Refactoring branch |
| `docs/api-endpoints` | Documentation branch |
| `chore/upgrade-deps` | Dependency updates |

---

## Comment Guidelines

### When to comment

- Non-obvious business logic.
- Workarounds for known issues (with a link to the issue).
- Public API documentation (JSDoc on exported functions).

### When NOT to comment

- Obvious code (`// increment counter` above `counter++`).
- Commented-out code. Delete it. Git remembers.
- TODOs without an issue reference. Either create an issue or fix it now.

### Format

```typescript
// Single-line comment for a quick clarification.

/**
 * Calculates the user's productivity score for a given date range.
 * Score is a weighted average of task completion rate, focus time,
 * and plan adherence.
 */
function calculateProductivityScore(userId: string, startDate: Date, endDate: Date): number {
  ...
}
```

---

## Error Handling Standards

### Frontend

- API errors are caught in the service layer and re-thrown as typed errors.
- Hooks catch errors and expose them via an `error` property.
- Components display errors using the `Toast` or `ErrorBoundary` components.
- Never use `console.error` in production code. Use the toast system.

### Backend

- All errors are thrown as `AppError` instances with a status code and error code.
- Controllers wrap service calls in try/catch and pass errors to `next(error)`.
- The error handler middleware catches everything and formats the response.
- Prisma errors are mapped to appropriate HTTP status codes.
- Never swallow errors silently. Every error either recovers or propagates.

---

## Formatting Rules

### Shared

- 2 spaces for indentation (no tabs).
- Single quotes for strings in TypeScript.
- Double quotes for JSX attributes.
- Semicolons required.
- Trailing commas on multi-line arrays and objects.
- Max line length: 100 characters (soft limit, not enforced for long strings).
- Blank line between logical sections of a function.
- No blank lines at the start or end of a block.

### Imports

Imports are ordered in groups separated by blank lines:

1. External packages (`react`, `next`, `express`, `zod`).
2. Internal absolute imports (`@/components/...`, `@/services/...`).
3. Relative imports (`./utils`, `../config`).

```typescript
import { useState } from "react";
import Link from "next/link";

import { TaskCard } from "@/components/data-display/TaskCard";
import { useTasks } from "@/hooks/useTasks";

import { formatDate } from "./utils";
```

---

## Architecture Rules

1. **No circular imports.** If module A imports from module B, module B must not import from module A.
2. **No cross-layer imports.** Controllers do not import from repositories. Services do not import from controllers.
3. **No frontend business logic.** The frontend validates forms for UX. The backend validates everything for security.
4. **No backend UI knowledge.** The backend never returns HTML, CSS classes, or component names.
5. **No shared node_modules.** Frontend and backend have completely independent dependencies.
6. **No `any` type.** Use `unknown` and narrow with type guards. Exceptions require a comment explaining why.
7. **No magic numbers or strings.** Extract to named constants.
8. **No nested ternaries.** Use early returns or switch statements.
9. **No God functions.** If a function does more than one thing, split it.
10. **No premature abstraction.** Write it inline first. Abstract when there are three instances of the same pattern.
