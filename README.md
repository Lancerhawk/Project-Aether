# Aether

**Smart daily planning and execution platform for students, developers, and project workers.**

Aether is an intelligent productivity system designed to help you plan, execute, and analyze your work with clarity. It brings together task management, goal tracking, daily planning, and productivity analytics into a single cohesive platform.

## Vision

Most productivity tools are either too simple (basic to-do lists) or too complex (enterprise project management suites). Aether sits in the sweet spot — opinionated enough to guide your workflow, flexible enough to adapt to how you actually work.

**Future capabilities include:**
- Intelligent task management with priorities and deadlines
- Project and goal organization
- Smart daily planning engine
- Execution tracking and streaks
- Productivity analytics and insights

## Repository Structure

This is a monorepo with **fully separated** frontend and backend projects:

```
aether/
├── frontend/          # Next.js web application
│   ├── src/           # Application source code
│   ├── package.json   # Frontend dependencies (independent)
│   └── ...
├── backend/           # Express API server
│   ├── src/           # Server source code
│   ├── prisma/        # Database schema and migrations
│   ├── package.json   # Backend dependencies (independent)
│   └── ...
├── docs/              # Architecture and design documentation
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── frontend.md
│   ├── backend.md
│   ├── folder-structure.md
│   ├── coding-guidelines.md
│   ├── design-system.md
│   └── roadmap.md
├── README.md          # This file
├── CHANGELOG.md       # Release history
└── .gitignore
```

### Separation Philosophy

Frontend and backend are **completely independent** projects:
- Separate `package.json` files and `node_modules`
- Frontend deploys to **Vercel**
- Backend deploys to **EC2**
- No shared runtime dependencies
- Each can be developed, tested, and deployed independently

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend   | Node.js, Express, TypeScript        |
| Database  | PostgreSQL via Prisma ORM (Supabase) |
| Tooling   | ESLint, Prettier                    |

## Documentation

All architecture and design decisions are documented in the `docs/` folder:

| Document | Description |
|---|---|
| [Architecture](docs/architecture.md) | System overview, layer responsibilities, request lifecycle |
| [Database](docs/database.md) | Complete entity design with relationships and indexes |
| [API](docs/api.md) | Full REST API specification for all modules |
| [Frontend](docs/frontend.md) | Routing, components, hooks, services, state management |
| [Backend](docs/backend.md) | Controllers, services, repositories, middleware, validation |
| [Folder Structure](docs/folder-structure.md) | What goes where in both projects |
| [Coding Guidelines](docs/coding-guidelines.md) | Naming, git conventions, formatting, architecture rules |
| [Design System](docs/design-system.md) | Colors, typography, spacing, animations, accessibility |
| [Roadmap](docs/roadmap.md) | Version plan from v0.1.0 to v1.0.0 |

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL (or Supabase account)

### Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npm run dev             # Starts on http://localhost:3001
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev             # Starts on http://localhost:3000
```

## Versioning

Aether follows [Semantic Versioning](https://semver.org/):

- **Major** (`x.0.0`) — Breaking changes or major redesigns
- **Minor** (`0.x.0`) — New features and capabilities
- **Patch** (`0.0.x`) — Bug fixes and minor improvements

Current version: **v0.2.0** (Architecture)

## License

This project is proprietary. All rights reserved.
