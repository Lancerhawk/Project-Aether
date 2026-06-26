# Aether Backend

Express + TypeScript API server with Prisma ORM for the Aether platform.

## Quick Start

```bash
cp .env.example .env        # Configure environment
npm install                  # Install dependencies
npx prisma generate          # Generate Prisma client
npm run dev                  # Start dev server (http://localhost:5000)
```

## Scripts

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start development server           |
| `npm run build`      | Compile TypeScript to JavaScript   |
| `npm start`          | Run production build               |
| `npm run lint`       | Run ESLint                         |
| `npm run format`     | Format code with Prettier          |
| `npm run prisma:generate` | Generate Prisma client        |
| `npm run prisma:migrate`  | Run database migrations       |

## Architecture

```
src/
├── server.ts           # Entry point
├── app.ts              # Express app configuration
├── config/             # Environment and database config
├── controllers/        # Request handlers
├── middlewares/        # Express middleware
├── routes/             # Route definitions
├── services/           # Business logic (future)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## API Endpoints

| Method | Path      | Description    |
|--------|-----------|----------------|
| GET    | `/health` | Health check   |
