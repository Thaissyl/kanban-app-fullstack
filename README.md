# Todo App - Full Stack

Full-stack todo application with kanban-style board interface, built with NestJS, React, and PostgreSQL.

## Tech Stack

**Backend:** NestJS 11.0.1 | Prisma 7.2.0 | PostgreSQL 15 | TypeScript 5.7.3
**Frontend:** React 19.2.0 | Vite 7.2.4 | TypeScript 5.9.3
**Infrastructure:** Docker Compose | pnpm Workspace

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start PostgreSQL Database
```bash
docker-compose up -d
```

### 3. Run Database Migrations
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Servers

**Backend (Terminal 1):**
```bash
cd backend
pnpm run start:dev
# Runs on http://localhost:3000/api
```

**Frontend (Terminal 2):**
```bash
cd frontend
pnpm run dev
# Runs on http://localhost:5173
```

## Project Structure

```
todo-app-fullstack/
├── backend/          # NestJS API server
│   ├── prisma/      # Database schema & migrations
│   └── src/         # Source code
│       ├── common/  # Shared utilities
│       └── todo/    # Todo feature module
├── frontend/        # React SPA
│   └── src/        # React components
├── docs/           # Documentation
└── docker-compose.yml
```

## Available Scripts

### Backend
```bash
cd backend
pnpm run start:dev    # Development with hot-reload
pnpm run build        # Build for production
pnpm run start:prod   # Run production build
pnpm run lint         # ESLint with auto-fix
pnpm run test         # Run unit tests
pnpm run test:e2e     # Run E2E tests
pnpm run test:cov     # Generate coverage report

# Prisma commands
npx prisma migrate dev --name init  # Create migration
npx prisma generate                 # Generate Prisma Client
npx prisma studio                   # Open Prisma Studio UI
```

### Frontend
```bash
cd frontend
pnpm run dev         # Start Vite dev server
pnpm run build       # Build for production
pnpm run preview     # Preview production build
pnpm run lint        # ESLint
```

### Docker
```bash
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs -f   # View logs
```

## API Documentation

### Base URL
- Development: `http://localhost:3000/api`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/todo` | Create new todo |
| GET | `/api/todo` | Get all todos (sorted) |
| PATCH | `/api/todo/:id/move` | Move todo between columns |
| DELETE | `/api/todo/:id` | Delete todo |

### Response Format
All responses wrapped in:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-01-08T..."
}
```

See [docs/codebase-summary.md](./docs/codebase-summary.md) for detailed API docs.

## Database

**Connection:** `postgresql://thaibeo:password@localhost:5434/todo_db?schema=public`

### Todo Model
```prisma
model Todo {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  position    Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

## Development Workflow

1. **Feature Development:**
   - Create feature branch
   - Implement following [code-standards.md](./docs/code-standards.md)
   - Add tests
   - Update documentation

2. **Database Changes:**
   ```bash
   # Edit schema.prisma
   npx prisma migrate dev --name describe_change
   npx prisma generate
   ```

3. **Code Quality:**
   ```bash
   # Backend
   cd backend && pnpm run lint

   # Frontend
   cd frontend && pnpm run lint
   ```

## Documentation

- [Project Overview & PDR](./docs/project-overview-pdr.md) - Product requirements and roadmap
- [Codebase Summary](./docs/codebase-summary.md) - Technical stack and API documentation
- [Code Standards](./docs/code-standards.md) - Conventions and patterns
- [System Architecture](./docs/system-architecture.md) - Architecture diagrams and design decisions

## Current Status

### Completed
- Backend API with CRUD operations
- PostgreSQL database with Prisma ORM
- Docker Compose configuration
- Zod validation and response wrapping

### In Progress
- Frontend todo UI implementation
- Kanban board with drag-and-drop
- Error handling and loading states

### Planned
- User authentication
- Advanced filtering and search
- Responsive design improvements
- Production deployment

## Contributing

1. Follow [code-standards.md](./docs/code-standards.md)
2. Write tests for new features
3. Update relevant documentation
4. Submit PR with clear description

## License

UNLICENSED

---

**Version:** 1.0.0
**Last Updated:** 2026-01-08