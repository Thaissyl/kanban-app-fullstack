# Project Overview & Product Development Requirements

## Project Purpose

Full-stack todo application built with modern technologies to provide a clean, efficient task management system with drag-and-drop kanban-style board interface.

**Core Objectives:**
- Demonstrate production-ready full-stack development practices
- Implement RESTful API with NestJS backend
- Build responsive React frontend with TypeScript
- Follow architectural patterns for scalability

## Technology Stack

### Backend
- **Framework:** NestJS v11.0.1 (Node.js framework)
- **Database:** PostgreSQL 15
- **ORM:** Prisma v7.2.0
- **Language:** TypeScript v5.7.3
- **Validation:** Zod v4.3.5

### Frontend
- **Framework:** React v19.2.0
- **Build Tool:** Vite v7.2.4
- **Language:** TypeScript v5.9.3
- **HTTP Client:** Axios v1.13.2

### Infrastructure
- **Containerization:** Docker Compose
- **Package Manager:** pnpm (Workspace/Monorepo)

## Current State

### Completed Features

#### Backend (80% Complete)
- ✅ NestJS application bootstrap with CORS and global API prefix
- ✅ Prisma integration with PostgreSQL
- ✅ Todo CRUD operations
- ✅ Global response wrapper interceptor
- ✅ Zod validation pipe
- ✅ Docker Compose configuration
- ✅ Database schema with task status enum

#### API Endpoints (Operational)
All endpoints under `/api` prefix:
- `POST /api/todo` - Create todo
- `GET /api/todo` - Get all todos (sorted by status + position)
- `PATCH /api/todo/:id/move` - Move task between columns
- `DELETE /api/todo/:id` - Delete todo

### Frontend (10% Complete)
- ✅ Vite + React + TypeScript setup
- ✅ Basic Axios configuration
- ❌ Todo UI not implemented
- ❌ Kanban board UI not implemented
- ❌ Environment variables not configured

## Known Issues & Technical Debt

### Critical Issues

1. **Frontend API Client Issues**
   - `api.ts` misplaced in root directory (should be in `frontend/src/`)
   - Hardcoded API URL (`http://localhost:3000/todo`)
   - Missing `/api` prefix in API calls
   - No error handling in API calls
   - Missing update/move functionality in API client

2. **Frontend Architecture**
   - Default Vite template still in place
   - No component organization structure
   - Missing state management solution
   - No UI component library

3. **Environment Configuration**
   - No `.env` file examples
   - No environment-specific configs
   - Hardcoded database credentials in docker-compose.yml

### Medium Priority Issues

4. **Code Quality**
   - Vietnamese comments mixed with English code
   - Missing unit tests
   - No E2E tests implemented
   - Missing API documentation (Swagger/OpenAPI)

5. **Developer Experience**
   - No README.md exists
   - No contribution guidelines
   - No development workflow documentation
   - No pre-commit hooks

## Product Development Requirements

### Phase 1: Foundation (Current Sprint)

**P0 - Critical Path Items**
1. Implement comprehensive error handling in frontend API client
2. Add environment variable support for API URLs
3. Create component structure for frontend
4. Implement basic todo CRUD UI

**Acceptance Criteria:**
- All API calls include error handling with user-friendly messages
- Frontend works with both local and production API URLs via env vars
- Components follow React best practices with TypeScript
- Basic CRUD operations work end-to-end

### Phase 2: Core Features (Next Sprint)

**P1 - High Priority**
1. Implement kanban-style board UI with drag-and-drop
2. Add task status management (TODO → IN_PROGRESS → DONE)
3. Implement task positioning/reordering
4. Add task descriptions
5. Form validation with user feedback

**Acceptance Criteria:**
- Visual kanban board with three columns
- Drag and drop tasks between columns
- Reorder tasks within columns
- All CRUD operations update UI immediately
- Form inputs validated on client and server

### Phase 3: Polish & Enhancement

**P2 - Medium Priority**
1. Add loading states and optimistic updates
2. Implement undo/redo for destructive actions
3. Add task filtering and search
4. Responsive design for mobile devices
5. Dark mode support

**P3 - Nice to Have**
1. User authentication
2. Multiple boards/projects
3. Task labels/tags
4. Due dates and reminders
5. Collaborative features

## Development Roadmap

### Immediate Actions (This Week)
1. Fix API client issues in frontend
2. Set up environment variables
3. Create basic todo list UI
4. Implement error handling

### Short-term (2-4 Weeks)
1. Build kanban board interface
2. Implement drag-and-drop functionality
3. Add comprehensive testing
4. Write API documentation

### Long-term (1-3 Months)
1. Add user authentication
2. Implement advanced features
3. Performance optimization
4. Deployment to production

## Technical Constraints

- Must maintain backward compatibility with existing API
- Database migrations must be non-destructive
- Frontend must support modern browsers (Chrome, Firefox, Safari, Edge)
- API response format must follow established wrapper pattern
- All new code must include TypeScript types

## Success Metrics

- All API endpoints tested with automated tests
- Frontend achieves 90%+ test coverage
- Application loads in < 2 seconds
- Zero critical bugs in production
- Positive developer experience feedback

## Dependencies

### External APIs
- None (currently self-contained)

### Third-party Services
- PostgreSQL database (Docker container)
- May add: Authentication provider, cloud storage

### System Requirements
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15 client tools

---

**Last Updated:** 2026-01-08
**Version:** 1.0.0
**Status:** Initial Draft