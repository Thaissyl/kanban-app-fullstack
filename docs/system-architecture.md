# System Architecture

## Overview

Three-tier full-stack architecture with containerized PostgreSQL database, RESTful NestJS backend, and React SPA frontend.

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│   Frontend  │────────▶│   Backend   │
│  (React)    │◀────────│    (Vite)   │◀────────│   (NestJS)  │
└─────────────┘         └─────────────┘         └──────┬──────┘
                                                           │
                                                           ▼
                                                    ┌─────────────┐
                                                    │ PostgreSQL  │
                                                    │  (Prisma)   │
                                                    └─────────────┘
```

## System Components

### 1. Frontend Layer (React SPA)

**Responsibilities:**
- User interface rendering
- Client-side state management
- API communication
- User input handling

**Technology:**
- React 19.2.0 for UI components
- Vite 7.2.4 for build tooling
- Axios 1.13.2 for HTTP requests
- TypeScript 5.9.3 for type safety

**Data Flow:**
```
User Action → Component Event Handler
            → API Client (Axios)
            → HTTP Request to Backend
            → State Update
            → Re-render
```

### 2. Backend Layer (NestJS API)

**Responsibilities:**
- HTTP request handling
- Business logic execution
- Data validation
- Database operations

**Technology:**
- NestJS 11.0.1 (Node.js framework)
- Prisma 7.2.0 (ORM)
- Zod 4.3.5 (validation)
- TypeScript 5.7.3

**Request Flow:**
```
HTTP Request → Global Interceptors
            → Controller (Route Handler)
            → Validation Pipe (Zod)
            → Service (Business Logic)
            → Prisma Service (Data Access)
            → Database Query
            → Response Transformation
            → HTTP Response
```

**Key Architectural Patterns:**

**Modular Architecture:**
```typescript
AppModule
├── Imports: [TodoModule]
├── Controllers: [AppController]
└── Providers: [PrismaService]

TodoModule
├── Controllers: [TodoController]
├── Providers: [TodoService]
└── Exports: [TodoService]
```

**Dependency Injection:**
- Controllers inject Services
- Services inject PrismaService
- Singleton scope for services
- Constructor injection pattern

### 3. Data Layer (PostgreSQL)

**Responsibilities:**
- Persistent data storage
- Data integrity enforcement
- Query optimization
- Transaction management

**Technology:**
- PostgreSQL 15
- Prisma ORM for type-safe queries
- Connection pooling via Prisma

**Schema Design:**
```prisma
Todo Table
├── id (PK, auto-increment)
├── title (VARCHAR, NOT NULL)
├── description (TEXT, nullable)
├── status (ENUM: TODO|IN_PROGRESS|DONE)
├── position (INT, default 0)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)
```

**Indexes (Implicit):**
- Primary key on `id`
- Index on `status` (for sorting)
- Index on `position` (for ordering)

## Data Flow Diagrams

### Create Todo Flow

```
┌─────────┐   POST /api/todo   ┌────────────┐
│ Browser │───────────────────▶│ Controller │
└─────────┘                    └──────┬─────┘
                                      │
                                      ▼
                              ┌──────────────────┐
                              │ Validation Pipe  │
                              │   (Zod Schema)   │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  TodoService     │
                              │  .create()       │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  PrismaService   │
                              │  .todo.create()  │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │   PostgreSQL     │
                              │   INSERT TODO    │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │ Transform Inter. │
                              │ Wrap Response    │
                              └────────┬─────────┘
                                       │
                                       ▼
                               { success: true,
                                 data: {...},
                                 timestamp: "..." }
```

### Get Todos Flow

```
Browser ──GET /api/todo──▶ Controller
                                │
                                ▼
                         TodoService.findAll()
                                │
                                ▼
                    Prisma.todo.findMany({
                      orderBy: [
                        { status: 'asc' },
                        { position: 'asc' }
                      ]
                    })
                                │
                                ▼
                    PostgreSQL: SELECT * FROM todo
                    ORDER BY status ASC, position ASC
                                │
                                ▼
                    Transform Interceptor → Wrap Response
                                │
                                ▼
                    Browser ← { success: true, data: [...todos] }
```

## API Design Patterns

### RESTful Conventions

| Action | HTTP Method | Endpoint | Description |
|--------|-------------|----------|-------------|
| Create | POST | `/api/todo` | Create new resource |
| Read | GET | `/api/todo` | List all resources |
| Update | PATCH | `/api/todo/:id/move` | Partial update |
| Delete | DELETE | `/api/todo/:id` | Delete resource |

### Response Format (Global Wrapper)

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;      // Always true for successful responses
  data: T;              // Response payload
  timestamp: string;    // ISO-8601 timestamp
}
```

**Rationale:**
- Consistent client-side parsing
- Easy error detection
- Audit trail via timestamp
- Extensible for metadata

### Validation Strategy

**Layer 1: Client-Side (Future)**
- React Hook Form / Zod validation
- Immediate user feedback

**Layer 2: Server-Side (Current)**
- Zod schemas in DTOs
- Custom `ZodValidationPipe`
- Automatic validation on decorated endpoints

```typescript
// Example
@UsePipes(new ZodValidationPipe(createTodoSchema))
create(@Body() createTodoDto: CreateTodoDto) {
  // DTO validated before execution
}
```

## Database Design

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
```

**Design Decisions:**

1. **Auto-increment ID**: Simple, sequential, sufficient for single-tenant app
2. **Nullable Description**: Optional feature, flexibility for simple todos
3. **Enum Status**: Type-safe, enforces valid states at database level
4. **Position Field**: Supports drag-and-drop ordering within columns
5. **Timestamps**: Audit trail for debugging and analytics

### Query Optimization

**Indexed Queries:**
```typescript
// Efficient: Uses status + position index
todo.findMany({
  orderBy: [{ status: 'asc' }, { position: 'asc' }]
})

// Efficient: Uses primary key
todo.findUnique({ where: { id } })
```

**Future Optimizations:**
- Add composite index on `(status, position)`
- Pagination for large datasets
- Caching layer (Redis) for frequent reads

## Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────────┐
│              Docker Compose                  │
│  ┌────────────┐      ┌────────────┐        │
│  │ PostgreSQL │◀────▶│  NestJS    │        │
│  │  :5434     │      │  :3000     │        │
│  └────────────┘      └────────────┘        │
│                                              │
│  ┌────────────┐                             │
│  │   Vite     │ (Separate terminal)         │
│  │  :5173     │─────────────────────┐       │
│  └────────────┘                     │       │
└─────────────────────────────────────┼───────┘
                                      │
                                      ▼
                             Host Machine (Windows)
```

**Port Mappings:**
- PostgreSQL: `5434:5432` (host:container)
- Backend: `3000:3000`
- Frontend: `5173` (Vite dev server)

### Production Environment (Planned)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Nginx     │──────▶│   Backend   │──────▶│ PostgreSQL  │
│   (Reverse  │       │  (NestJS)   │       │ (Managed DB) │
│   Proxy)    │       │             │       │             │
└─────────────┘       └─────────────┘       └─────────────┘
     │
     ├────────────▶ Frontend (Static Files)
     │              (CDN or S3)
     ▼
  Internet
```

**Considerations:**
- Use managed PostgreSQL (AWS RDS, Neon, Supabase)
- Backend on container platform (AWS ECS, Railway, Render)
- Frontend as static assets on CDN
- Nginx for SSL termination and routing

## Security Architecture

### Current Implementation
- CORS enabled for development
- No authentication (Phase 1)
- No rate limiting
- Hardcoded credentials in docker-compose.yml

### Planned Security Measures
1. **Authentication**: JWT-based auth (Phase 3)
2. **Authorization**: Role-based access control
3. **Rate Limiting**: Prevent API abuse
4. **Input Validation**: Zod schemas on all inputs
5. **SQL Injection Prevention**: Prisma parameterized queries
6. **CORS**: Restrict to production domain
7. **Secrets Management**: Environment variables only

## Scalability Considerations

### Current Limitations
- Single PostgreSQL instance
- No caching layer
- No horizontal scaling
- Synchronous operations

### Future Scalability Path
1. **Phase 1**: Connection pooling, query optimization
2. **Phase 2**: Redis caching for read-heavy operations
3. **Phase 3**: Database read replicas
4. **Phase 4**: Horizontal backend scaling with load balancer
5. **Phase 5**: Microservices decomposition (if needed)

## Technology Rationale

### Why NestJS?
- Structured, opinionated architecture
- Built-in dependency injection
- Excellent TypeScript support
- Enterprise-ready patterns
- Large ecosystem and community

### Why Prisma?
- Type-safe database queries
- Excellent TypeScript integration
- Automatic migrations
- Great developer experience
- Database-agnostic (future flexibility)

### Why React + Vite?
- React: Industry standard, large ecosystem
- Vite: Fast development, modern build tool
- TypeScript: Type safety catches bugs early
- Axios: Simple, widely adopted HTTP client

---

**Last Updated:** 2026-01-08
**Version:** 1.0.0