# 📝 Todo App - Full Stack

Full-stack todo application with kanban-style board interface, built with NestJS, React, and PostgreSQL.

## 🛠 Tech Stack

| Backend | Frontend | Infrastructure |
|---------|----------|----------------|
| NestJS `11.0.1` | React `19.2.0` | Docker Compose |
| Prisma `7.2.0` | Vite `7.2.4` | pnpm Workspace |
| PostgreSQL `15` | TypeScript `5.9.3` | |
| TypeScript `5.7.3` | Axios `1.13.2` | |

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **pnpm** 8+
- **Docker** & Docker Compose

### One-Command Setup (First Time)

```bash
# Install deps + Start DB + Run migrations + Start both servers
pnpm install && docker-compose up -d && (cd backend && npx prisma migrate dev && npx prisma generate) && (cd backend && pnpm run start:dev & cd frontend && pnpm run dev)
```

### Step-by-Step

**1️⃣ Install Dependencies**
```bash
pnpm install
```

**2️⃣ Start Database & Migrate**
```bash
docker-compose up -d                    # Start PostgreSQL
cd backend && npx prisma migrate dev    # Run migrations
npx prisma generate                     # Generate Prisma Client
cd ..                                   # Return to root
```

**3️⃣ Start Development Servers**
```bash
# Terminal 1 - Backend (http://localhost:3000/api)
cd backend && pnpm run start:dev

# Terminal 2 - Frontend (http://localhost:5173)
cd frontend && pnpm run dev
```

## 📁 Project Structure

```
todo-app-fullstack/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema with Todo model
│   │   └── migrations/            # SQL migration history
│   ├── src/
│   │   ├── main.ts                # NestJS bootstrap (port 3000, CORS, /api prefix)
│   │   ├── app.module.ts          # Root module with PrismaService provider
│   │   ├── common/
│   │   │   ├── interceptors/
│   │   │   │   └── transform.interceptor.ts  # Wraps responses in {success, data, timestamp}
│   │   │   └── pipes/
│   │   │       └── zod-validation.pipe.ts    # Zod schema validation
│   │   ├── prisma/
│   │   │   └── prisma.service.ts            # PrismaService wrapper (auto-connect)
│   │   └── todo/
│   │       ├── todo.controller.ts           # GET/POST/PATCH/DELETE /api/todo endpoints
│   │       ├── todo.service.ts              # Business logic + Prisma queries
│   │       ├── todo.module.ts               # Todo feature module
│   │       ├── dto/                         # Zod validation schemas
│   │       └── entities/                    # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Root component
│   │   ├── api.ts                   # Axios client (baseURL: http://localhost:3000/todo)
│   │   └── assets/                  # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docs/
│   ├── project-overview-pdr.md      # Product requirements & roadmap
│   ├── codebase-summary.md          # Tech stack & API docs
│   ├── code-standards.md            # Conventions & patterns
│   └── system-architecture.md       # Architecture diagrams
├── docker-compose.yml               # PostgreSQL + Backend services
├── package.json                     # Root pnpm workspace config
└── README.md
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

## 🔧 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement following [code-standards.md](./docs/code-standards.md)
   - Add tests
   - Update documentation

2. **Database Changes**
   ```bash
   # Edit schema.prisma
   npx prisma migrate dev --name describe_change
   npx prisma generate
   ```

3. **Code Quality**
   ```bash
   # Backend
   cd backend && pnpm run lint

   # Frontend
   cd frontend && pnpm run lint
   ```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Project Overview & PDR](./docs/project-overview-pdr.md) | Product requirements and roadmap |
| [Codebase Summary](./docs/codebase-summary.md) | Technical stack and API documentation |
| [Code Standards](./docs/code-standards.md) | Conventions and patterns |
| [System Architecture](./docs/system-architecture.md) | Architecture diagrams and design decisions |

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** `Can't reach database server`
```bash
# Check Docker container status
docker-compose ps

# Restart database
docker-compose restart db

# View database logs
docker-compose logs db
```

### Prisma Issues

**Problem:** `PGRST116` or migration errors
```bash
# Reset database (⚠️ deletes all data)
cd backend
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate
```

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use ::3000`
```bash
# Find process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # macOS/Linux

# Kill the process or use different port
```

### Migration History Conflicts

**Problem:** Migration out of sync
```bash
# Resolve migration drift
cd backend
npx prisma migrate resolve --applied "migration_name"
```

### Docker Issues

**Problem:** Container fails to start
```bash
# Rebuild containers
docker-compose down -v
docker-compose up -d --build

# Clean rebuild (⚠️ deletes database data)
docker-compose down -v
docker volume prune
docker-compose up -d --build
```

## ✅ Current Status

### Completed
- ✅ Backend API with CRUD operations
- ✅ PostgreSQL database with Prisma ORM
- ✅ Docker Compose configuration
- ✅ Zod validation and response wrapping

### In Progress
- 🚧 Frontend todo UI implementation
- 🚧 Kanban board with drag-and-drop
- 🚧 Error handling and loading states

### Planned
- 📋 User authentication
- 📋 Advanced filtering and search
- 📋 Responsive design improvements
- 📋 Production deployment

## 🤝 Contributing

1. Follow [code-standards.md](./docs/code-standards.md)
2. Write tests for new features
3. Update relevant documentation
4. Submit PR with clear description

## 📄 License

UNLICENSED

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-08