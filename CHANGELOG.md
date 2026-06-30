# Changelog

All notable changes to the Aether project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-06-30

### Added
- **Core Task Management Engine:** Complete system for managing tasks, subtasks, and tags.
- **Database Schema:** `Task`, `SubTask`, `Tag`, and `TaskTag` models with priority, energy levels, and status tracking.
- **Advanced Filtering & Sorting:** Backend and frontend support for complex querying (status, priority, tags, dates).
- **Soft Delete & Trash:** Tasks are soft-deleted and moved to a dedicated Trash page for restoration or permanent deletion.
- **Bulk Operations:** Multi-select tasks to complete, archive, or delete them in bulk.
- **UI Components:** New `TaskCard`, `TaskTable`, `TaskDrawer`, and `TagSelector` components with premium styling and interactions.
- **TanStack Query:** Integrated React Query for robust data fetching, caching, and optimistic UI updates.


## [0.3.0] - 2026-06-27

### Added
- **Authentication System:** Complete JWT-based authentication with robust refresh token rotation.
- **GitHub OAuth:** Users can now log in securely via GitHub.
- **User Models:** `User` and `UserSettings` Prisma schemas with PostgreSQL UUIDs and enums.
- **Protected Routes:** `AuthGuard` on frontend and `authenticate` middleware on backend.
- **Settings UI:** New settings page allowing users to customize themes, timezones, and Pomodoro timers.
- **Auto Session Restoration:** Frontend silently restores session on mount via refresh tokens.
- **API Utilities:** Robust error handling (`AppError`), pagination wrappers, and Zod validation middleware.
- **Toast Notifications:** Built-in React context for success/error alerts across the app.

## [0.2.0] - 2026-06-26

### Added

- **Documentation**: Complete architecture and design documentation in `docs/`
  - System architecture with layer responsibilities and request lifecycle
  - Database design for all 17 entities with ER diagram, indexes, and extensibility notes
  - Full REST API specification covering all modules and endpoints
  - Frontend architecture (routing, components, hooks, services, state management)
  - Backend architecture (controllers, services, repositories, middleware, validation)
  - Folder structure guide for both frontend and backend
  - Coding guidelines (naming conventions, git standards, formatting rules)
  - Design system (color palette, typography, spacing, animations, accessibility)
  - Version roadmap from v0.1.0 through v1.0.0

### Changed

- Updated README with documentation links and current tech stack versions
- Bumped frontend to Next.js 16 and React 19 for Tailwind CSS v4 compatibility

---

## [0.1.0] - 2026-06-26

### Added

- Project scaffold with separated frontend and backend architecture
- **Frontend**: Next.js 16 with TypeScript and Tailwind CSS v4
  - Polished dark-themed landing page with hero, features, and CTA sections
  - Dashboard shell with sidebar layout
  - Responsive navbar and footer components
  - Reusable UI component library foundation
- **Backend**: Express with TypeScript and Prisma ORM
  - Health check endpoint (`GET /health`)
  - Centralized error handling middleware
  - Request logging middleware
  - Prisma configured for PostgreSQL
  - Minimal User model as database seed
  - Standardized API response utilities
- **Tooling**: ESLint and Prettier configured for both projects
- **Documentation**: README files, changelogs, and environment setup guides
