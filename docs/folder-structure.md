# Aether — Folder Structure

## Overview

Both the frontend and backend follow strict folder conventions. Every folder has a defined responsibility. Files are placed based on what they do, not what feature they belong to.

---

## Frontend

```
frontend/
├── public/                         → Static assets served as-is
│   ├── favicon.ico
│   └── og-image.png
│
├── src/
│   ├── app/                        → Next.js App Router (pages and layouts)
│   │   ├── layout.tsx              → Root layout (fonts, metadata, global providers)
│   │   ├── page.tsx                → Landing page (public)
│   │   ├── login/
│   │   │   └── page.tsx            → Login / OAuth page
│   │   ├── (app)/                  → Route group for authenticated pages
│   │   │   ├── layout.tsx          → Dashboard shell (sidebar, topbar)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        → Dashboard overview
│   │   │   ├── tasks/
│   │   │   │   └── page.tsx        → Task management
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx        → Project list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    → Project detail
│   │   │   ├── goals/
│   │   │   │   ├── page.tsx        → Goal list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    → Goal detail
│   │   │   ├── planning/
│   │   │   │   ├── page.tsx        → Today's plan
│   │   │   │   └── tomorrow/
│   │   │   │       └── page.tsx    → Tomorrow planner
│   │   │   ├── focus/
│   │   │   │   └── page.tsx        → Focus session timer
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx        → Productivity analytics
│   │   │   ├── notes/
│   │   │   │   └── page.tsx        → Notes
│   │   │   ├── settings/
│   │   │   │   └── page.tsx        → User settings
│   │   │   └── notifications/
│   │   │       └── page.tsx        → Notification center
│   │   └── globals.css             → Global styles and Tailwind theme
│   │
│   ├── components/                 → Reusable React components
│   │   ├── ui/                     → Primitive UI elements (Button, Input, Modal, etc.)
│   │   ├── layout/                 → Structural components (Sidebar, Topbar, Footer)
│   │   ├── forms/                  → Form components (TaskForm, ProjectForm, etc.)
│   │   ├── data-display/           → Data rendering (TaskCard, Chart, StatCard, etc.)
│   │   ├── feedback/               → User feedback (Toast, ConfirmDialog, ErrorBoundary)
│   │   └── landing/                → Landing page sections (Hero, Features, CTA)
│   │
│   ├── hooks/                      → Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   ├── useProjects.ts
│   │   └── ...
│   │
│   ├── services/                   → HTTP client layer (one file per API module)
│   │   ├── api.ts                  → Base fetch wrapper with auth headers
│   │   ├── task.service.ts
│   │   ├── project.service.ts
│   │   └── ...
│   │
│   ├── types/                      → TypeScript type definitions
│   │   ├── task.ts
│   │   ├── project.ts
│   │   ├── api.ts                  → Response envelope types
│   │   ├── enums.ts                → Shared enum definitions
│   │   └── ...
│   │
│   ├── context/                    → React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── SidebarContext.tsx
│   │
│   └── utils/                      → Pure helper functions
│       ├── date.ts
│       ├── format.ts
│       ├── cn.ts                   → Tailwind class merging
│       ├── validation.ts
│       └── constants.ts
│
├── .env.example                    → Environment variable template
├── .env.local                      → Local environment overrides (not committed)
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

### Folder Responsibilities

| Folder | What goes here | What does NOT go here |
|---|---|---|
| `app/` | Pages, layouts, route-level metadata | Reusable components, hooks, services |
| `components/ui/` | Atomic UI elements that have no domain knowledge | Components that fetch data or contain business logic |
| `components/forms/` | Form components with field definitions and submit handlers | API calls (those go in hooks/services) |
| `components/data-display/` | Components that render data (cards, lists, charts) | Data fetching logic |
| `hooks/` | Stateful logic that bridges components and services | UI rendering, HTTP implementation details |
| `services/` | HTTP calls to the backend API | Business logic, UI state, caching logic |
| `types/` | TypeScript interfaces and type aliases | Runtime code, constants, utilities |
| `context/` | React Context providers and consumers | Heavy state logic (use hooks for that) |
| `utils/` | Pure functions with no side effects | Stateful logic, API calls, React hooks |

---

## Backend

```
backend/
├── prisma/
│   ├── schema.prisma               → Database schema definition
│   ├── migrations/                  → Generated migration files
│   └── seed.ts                      → Database seeding script
│
├── src/
│   ├── app.ts                       → Express app setup (middleware registration)
│   ├── server.ts                    → Server bootstrap (connect DB, start listening)
│   │
│   ├── config/                      → Application configuration
│   │   ├── env.ts                   → Environment variable validation (Zod)
│   │   ├── prisma.ts                → Prisma client singleton
│   │   ├── cors.ts                  → CORS configuration
│   │   └── index.ts                 → Re-exports
│   │
│   ├── routes/                      → Route definitions (one file per module)
│   │   ├── index.ts                 → Mounts all route modules under /api/v1
│   │   ├── health.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── project.routes.ts
│   │   ├── goal.routes.ts
│   │   ├── task.routes.ts
│   │   ├── planning.routes.ts
│   │   ├── scheduling.routes.ts
│   │   ├── session.routes.ts
│   │   ├── analytics.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── note.routes.ts
│   │   ├── attachment.routes.ts
│   │   ├── tag.routes.ts
│   │   └── settings.routes.ts
│   │
│   ├── controllers/                 → Request handlers (parse input, call service, send response)
│   │   ├── health.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── project.controller.ts
│   │   ├── goal.controller.ts
│   │   ├── task.controller.ts
│   │   ├── subtask.controller.ts
│   │   ├── planning.controller.ts
│   │   ├── scheduling.controller.ts
│   │   ├── session.controller.ts
│   │   ├── analytics.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── note.controller.ts
│   │   ├── attachment.controller.ts
│   │   ├── tag.controller.ts
│   │   └── settings.controller.ts
│   │
│   ├── services/                    → Business logic (one file per domain)
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── project.service.ts
│   │   ├── goal.service.ts
│   │   ├── task.service.ts
│   │   ├── subtask.service.ts
│   │   ├── planning.service.ts
│   │   ├── scheduling.service.ts
│   │   ├── session.service.ts
│   │   ├── analytics.service.ts
│   │   ├── notification.service.ts
│   │   ├── note.service.ts
│   │   ├── attachment.service.ts
│   │   ├── tag.service.ts
│   │   └── settings.service.ts
│   │
│   ├── repositories/                → Data access layer (Prisma queries)
│   │   ├── user.repository.ts
│   │   ├── project.repository.ts
│   │   ├── goal.repository.ts
│   │   ├── task.repository.ts
│   │   ├── subtask.repository.ts
│   │   ├── planning.repository.ts
│   │   ├── schedule-block.repository.ts
│   │   ├── session.repository.ts
│   │   ├── reminder.repository.ts
│   │   ├── notification.repository.ts
│   │   ├── note.repository.ts
│   │   ├── attachment.repository.ts
│   │   ├── tag.repository.ts
│   │   ├── task-tag.repository.ts
│   │   ├── recurring-task.repository.ts
│   │   ├── productivity-metric.repository.ts
│   │   └── settings.repository.ts
│   │
│   ├── middlewares/                  → Express middleware functions
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── requestLogger.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   ├── cors.middleware.ts
│   │   └── notFound.middleware.ts
│   │
│   ├── validators/                   → Zod schemas for request validation
│   │   ├── auth.validator.ts
│   │   ├── project.validator.ts
│   │   ├── goal.validator.ts
│   │   ├── task.validator.ts
│   │   ├── subtask.validator.ts
│   │   ├── planning.validator.ts
│   │   ├── scheduling.validator.ts
│   │   ├── session.validator.ts
│   │   ├── note.validator.ts
│   │   ├── tag.validator.ts
│   │   └── settings.validator.ts
│   │
│   ├── utils/                        → Pure utility functions
│   │   ├── response.ts              → sendSuccess, sendError helpers
│   │   ├── pagination.ts            → Pagination parsing and metadata
│   │   ├── date.ts                  → Date helpers
│   │   ├── crypto.ts                → Token and hash utilities
│   │   ├── errors.ts                → AppError class and error codes
│   │   └── logger.ts                → Structured logging
│   │
│   └── types/                        → Shared TypeScript types
│       ├── express.d.ts             → Express type augmentation (req.user)
│       ├── auth.types.ts
│       ├── pagination.types.ts
│       └── common.types.ts
│
├── .env.example                      → Environment variable template
├── .eslintrc.json
├── .prettierrc
├── package.json
└── tsconfig.json
```

### Folder Responsibilities

| Folder | What goes here | What does NOT go here |
|---|---|---|
| `routes/` | HTTP method + path mapping to controller functions | Business logic, validation schemas, database queries |
| `controllers/` | Input extraction, service calls, response formatting | Business rules, Prisma queries, direct response logic for errors |
| `services/` | Business logic, orchestration, side effects | HTTP parsing, Prisma queries, response formatting |
| `repositories/` | Prisma queries, pagination, filtering | Business rules, HTTP concerns, error response formatting |
| `middlewares/` | Cross-cutting concerns (auth, logging, validation, error handling) | Feature-specific logic |
| `validators/` | Zod schemas defining expected request shapes | Runtime logic, database queries |
| `utils/` | Pure helper functions used across layers | Stateful logic, database access |
| `config/` | Environment loading, client singletons, app-wide settings | Route definitions, business logic |
| `types/` | TypeScript type definitions and augmentations | Runtime code |

---

## Root Level

```
Project-aether/
├── backend/                        → Express API server
├── frontend/                       → Next.js frontend
├── docs/                           → Architecture and design documentation
├── .gitignore                      → Root gitignore
├── CHANGELOG.md                    → Version changelog
└── README.md                       → Project overview and setup
```

Each top-level folder is an independent project with its own `package.json`, `node_modules`, and configuration. They share nothing at the dependency level.
