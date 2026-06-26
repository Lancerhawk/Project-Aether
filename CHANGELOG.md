# Changelog

All notable changes to the Aether project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
