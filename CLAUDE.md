# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack todo application with:
- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** React + TypeScript + Vite
- **Package Manager:** pnpm (monorepo with workspace)

## Common Commands

### Root Level
```bash
pnpm install              # Install all dependencies
```

### Backend (`cd backend`)
```bash
pnpm run build           # Build TypeScript to dist/
pnpm run start:dev       # Development with hot-reload
pnpm run start:prod      # Production mode (runs dist/main)
pnpm run lint            # ESLint with auto-fix
pnpm run format          # Prettier formatting
pnpm run test            # Unit tests (Jest)
pnpm run test:e2e        # E2E tests
pnpm run test:cov        # Coverage report

# Prisma commands
npx prisma migrate dev   # Create and apply migration
npx prisma migrate dev --name init  # Named migration
npx prisma generate      # Generate Prisma Client
npx prisma studio        # Open Prisma Studio UI
```

### Frontend (`cd frontend`)
```bash
pnpm run dev             # Start Vite dev server
pnpm run build           # Build for production
pnpm run preview         # Preview production build
pnpm run lint            # ESLint
```

### Docker
```bash
docker-compose up -d     # Start PostgreSQL DB + backend
```

## Architecture

### Backend Structure
```
backend/src/
├── main.ts              # Entry point, sets up Nest app with CORS, global prefix 'api'
├── app.module.ts        # Root module, imports TodoModule, provides PrismaService
├── prisma/
│   ├── prisma.service.ts    # PrismaService wrapper for @prisma/client
│   └── prisma.service.spec.ts
├── todo/
│   ├── todo.module.ts       # Todo feature module
│   ├── todo.controller.ts   # HTTP endpoints
│   ├── todo.service.ts      # Business logic + Prisma queries
│   ├── dto/                 # Data transfer objects (Zod schemas)
│   └── entities/            # Type definitions
└── common/
    ├── interceptors/
    │   └── transform.interceptor.ts  # Wraps responses in {success, data, timestamp}
    └── pipes/
        └── zod-validation.pipe.ts    # Zod validation pipe
```

**Key patterns:**
- Global API prefix: `/api`
- Global interceptor wraps all responses in `{success: true, data: ..., timestamp: "..."}`
- PrismaService is provided at AppModule level, imported by feature modules
- DTOs use Zod for validation

### Database (Prisma)
- **Schema location:** `backend/prisma/schema.prisma`
- **Provider:** PostgreSQL
- **Connection:** `postgresql://user:pass@localhost:5434/todo_db?schema=public`
- **Models:**
  - `Todo` with fields: id, title, description?, status (enum: TODO/IN_PROGRESS/DONE), position, timestamps
- **Migrations:** `backend/prisma/migrations/`

### Frontend Structure
```
frontend/src/
├── main.tsx             # React entry
├── App.tsx              # Root component
├── api.ts               # Axios client configuration
└── assets/
```

## Development Workflow

1. **Database changes:** Modify `backend/prisma/schema.prisma` → `npx prisma migrate dev`
2. **Backend changes:** Edit `backend/src/*` → `pnpm run start:dev` auto-reloads
3. **Frontend changes:** Edit `frontend/src/*` → Vite HMR

## Role & Responsibilities

Your role is to analyze user requirements, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards.

## Workflows

- Primary workflow: `./.claude/workflows/primary-workflow.md`
- Development rules: `./.claude/workflows/development-rules.md`
- Orchestration protocols: `./.claude/workflows/orchestration-protocol.md`
- Documentation management: `./.claude/workflows/documentation-management.md`
- And other workflows: `./.claude/workflows/*`

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.
**IMPORTANT:** You must follow strictly the development rules in `./.claude/workflows/development-rules.md` file.
**IMPORTANT:** Before you plan or proceed any implementation, always read the `./README.md` file first to get context.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.

## Hook Response Protocol

### Privacy Block Hook (`@@PRIVACY_PROMPT@@`)

When a tool call is blocked by the privacy-block hook, the output contains a JSON marker between `@@PRIVACY_PROMPT_START@@` and `@@PRIVACY_PROMPT_END@@`. **You MUST use the `AskUserQuestion` tool** to get proper user approval.

**Required Flow:**

1. Parse the JSON from the hook output
2. Use `AskUserQuestion` with the question data from the JSON
3. Based on user's selection:
   - **"Yes, approve access"** → Use `bash cat "filepath"` to read the file (bash is auto-approved)
   - **"No, skip this file"** → Continue without accessing the file

**Example AskUserQuestion call:**
```json
{
  "questions": [{
    "question": "I need to read \".env\" which may contain sensitive data. Do you approve?",
    "header": "File Access",
    "options": [
      { "label": "Yes, approve access", "description": "Allow reading .env this time" },
      { "label": "No, skip this file", "description": "Continue without accessing this file" }
    ],
    "multiSelect": false
  }]
}
```

**IMPORTANT:** Always ask the user via `AskUserQuestion` first. Never try to work around the privacy block without explicit user approval.

## Python Scripts (Skills)

When running Python scripts from `.claude/skills/`, use the venv Python interpreter:
- **Linux/macOS:** `.claude/skills/.venv/bin/python3 scripts/xxx.py`
- **Windows:** `.claude\skills\.venv\Scripts\python.exe scripts\xxx.py`

This ensures packages installed by `install.sh` (google-genai, pypdf, etc.) are available.

## Documentation Management

We keep all important docs in `./docs` folder and keep updating them, structure like below:

```
./docs
├── project-overview-pdr.md
├── code-standards.md
├── codebase-summary.md
├── design-guidelines.md
├── deployment-guide.md
├── system-architecture.md
└── project-roadmap.md
```

**IMPORTANT:** *MUST READ* and *MUST COMPLY* all *INSTRUCTIONS* in project `./CLAUDE.md`, especially *WORKFLOWS* section is *CRITICALLY IMPORTANT*, this rule is *MANDATORY. NON-NEGOTIABLE. NO EXCEPTIONS. MUST REMEMBER AT ALL TIMES!!!*