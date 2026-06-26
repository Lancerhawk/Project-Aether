# Changelog

All notable changes to the Aether project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-26

### Added

- Project scaffold with separated frontend and backend architecture
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
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
