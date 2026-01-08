# Codebase Summary

## Technology Stack Overview

| Component | Technology | Version |
|-----------|-----------|---------|
| **Backend Framework** | NestJS | 11.0.1 |
| **Database** | PostgreSQL | 15 |
| **ORM** | Prisma | 7.2.0 |
| **Frontend Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.2.4 |
| **TypeScript** | TypeScript | 5.7.3 (backend), 5.9.3 (frontend) |
| **HTTP Client** | Axios | 1.13.2 |
| **Validation** | Zod | 4.3.5 |
| **Package Manager** | pnpm | Workspace |

## Directory Structure

```
todo-app-fullstack/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Database migrations
│   ├── src/
│   │   ├── main.ts              # Application entry point
│   │   ├── app.module.ts        # Root module
│   │   ├── app.controller.ts    # Root controller
│   │   ├── app.service.ts       # Root service
│   │   ├── common/
│   │   │   ├── interceptors/
│   │   │   │   └── transform.interceptor.ts  # Response wrapper
│   │   │   └── pipes/
│   │   │       └── zod-validation.pipe.ts    # Zod validation
│   │   ├── prisma/
│   │   │   └── prisma.service.ts  # Prisma service wrapper
│   │   └── todo/
│   │       ├── todo.module.ts
│   │       ├── todo.controller.ts  # HTTP endpoints
│   │       ├── todo.service.ts     # Business logic
│   │       └── dto/
│   │           └── create-todo.dto.ts  # Zod schemas
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx             # React entry
│   │   ├── App.tsx              # Root component
│   │   └── api.ts               # Axios API client (MISPLACED)
│   └── package.json
├── docs/                        # Documentation
├── docker-compose.yml           # Container orchestration
└── package.json                 # Root workspace config
```

## Key Files Reference

### Backend Core Files

| File | Purpose | Key Details |
|------|---------|-------------|
| `backend/src/main.ts` | Application bootstrap | Port 3000, CORS enabled, global prefix `/api` |
| `backend/src/app.module.ts` | Root module | Imports TodoModule, provides PrismaService |
| `backend/prisma/schema.prisma` | Database schema | Todo model with TaskStatus enum |
| `backend/src/common/interceptors/transform.interceptor.ts` | Response wrapper | Wraps all responses in `{success, data, timestamp}` |
| `backend/src/common/pipes/zod-validation.pipe.ts` | Validation pipe | Validates requests using Zod schemas |

### Feature Module: Todo

| File | Purpose | Key Details |
|------|---------|-------------|
| `backend/src/todo/todo.controller.ts` | HTTP endpoints | POST /, GET /, PATCH /:id/move, DELETE /:id |
| `backend/src/todo/todo.service.ts` | Business logic | CRUD operations with Prisma |
| `backend/src/todo/dto/create-todo.dto.ts` | Request validation | Zod schema for todo creation |

### Frontend Files

| File | Purpose | Status |
|------|---------|--------|
| `frontend/src/main.tsx` | React entry point | Default Vite template |
| `frontend/src/App.tsx` | Root component | Default Vite template, not implemented |
| `frontend/api.ts` | API client | Misplaced location, missing `/api` prefix |

### Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | PostgreSQL + Backend containers |
| `backend/package.json` | Backend dependencies & scripts |
| `frontend/package.json` | Frontend dependencies & scripts |
| `package.json` | Workspace configuration |

## API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- All endpoints use global `/api` prefix

### Endpoints

#### Create Todo
```http
POST /api/todo
Content-Type: application/json

{
  "title": "string",
  "description": "string (optional)",
  "status": "TODO" | "IN_PROGRESS" | "DONE",
  "position": number
}

Response:
{
  "success": true,
  "data": { Todo object },
  "timestamp": "ISO-8601"
}
```

#### Get All Todos
```http
GET /api/todo

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "string",
      "description": "string | null",
      "status": "TODO",
      "position": 0,
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601"
    }
  ],
  "timestamp": "ISO-8601"
}
```

**Sorting:** Returns todos ordered by `status` (asc) then `position` (asc)

#### Move Todo
```http
PATCH /api/todo/:id/move
Content-Type: application/json

{
  "status": "TODO" | "IN_PROGRESS" | "DONE",
  "position": number
}

Response:
{
  "success": true,
  "data": { updated Todo object },
  "timestamp": "ISO-8601"
}
```

#### Delete Todo
```http
DELETE /api/todo/:id

Response:
{
  "success": true,
  "data": { deleted Todo object },
  "timestamp": "ISO-8601"
}
```

## Database Schema

### PostgreSQL Database
- **Name:** `todo_db`
- **User:** `thaibeo`
- **Port:** 5434 (host), 5432 (container)
- **Connection:** `postgresql://thaibeo:password@localhost:5434/todo_db?schema=public`

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

### Field Descriptions
- `id`: Auto-incrementing primary key
- `title`: Task title (required)
- `description`: Optional task description
- `status`: Current status (default: TODO)
- `position`: Order position within status column
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

## Architecture Patterns

### Response Wrapper Pattern
All API responses wrapped in:
```typescript
{
  success: true,
  data: T,
  timestamp: string
}
```

### Validation Pattern
- Zod schemas in `dto/` directories
- Custom `ZodValidationPipe` for automatic validation
- Applied via `@UsePipes()` decorator

### Service Layer Pattern
- Controllers handle HTTP concerns
- Services contain business logic
- PrismaService for data access

### Dependency Injection
- NestJS DI container
- Services injected via constructor
- PrismaService provided at AppModule level

## Common Commands

### Backend
```bash
cd backend
pnpm run start:dev    # Development with hot-reload
pnpm run build        # Build to dist/
pnpm run start:prod   # Production mode
npx prisma migrate dev # Create & apply migration
npx prisma generate   # Generate Prisma Client
npx prisma studio     # Open Prisma Studio UI
```

### Frontend
```bash
cd frontend
pnpm run dev          # Start Vite dev server
pnpm run build        # Build for production
```

### Docker
```bash
docker-compose up -d  # Start PostgreSQL + backend
```

## Environment Variables

### Backend Required
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)

### Docker Configuration
- Database exposed on port 5434
- Backend exposed on port 3000
- Backend connects to `db:5432` internally

## Known Issues

See [project-overview-pdr.md](./project-overview-pdr.md) for detailed issues:
- Frontend API client misplaced and incomplete
- Missing environment variable configuration
- No error handling in frontend API calls
- Default Vite template not replaced

---

**Last Updated:** 2026-01-08
**Version:** 1.0.0