# Code Standards & Conventions

## File Organization

### Backend Structure (NestJS)

```
backend/src/
├── main.ts                    # Entry point ONLY
├── app.module.ts              # Root module
├── app.controller.ts          # Root controller (health check)
├── app.service.ts             # Root service
├── common/                    # SHARED code
│   ├── interceptors/          # Global interceptors
│   ├── pipes/                 # Custom pipes
│   ├── filters/               # Exception filters
│   ├── guards/                # Auth guards
│   └── decorators/            # Custom decorators
└── [feature]/                 # Feature modules
    ├── [feature].module.ts    # Feature module
    ├── [feature].controller.ts
    ├── [feature].service.ts
    ├── dto/                   # Request/Response DTOs
    │   ├── create-[feature].dto.ts
    │   ├── update-[feature].dto.ts
    │   └── [feature].response.dto.ts
    └── entities/              # Type definitions
```

### Frontend Structure (React)

```
frontend/src/
├── main.tsx                   # React entry
├── App.tsx                    # Root component
├── api/                       # API client layer
│   ├── client.ts              # Axios instance config
│   ├── todo.api.ts            # Todo API methods
│   └── types.ts               # API response types
├── components/                # Reusable components
│   ├── ui/                    # Base UI components
│   └── [feature]/             # Feature-specific components
├── hooks/                     # Custom React hooks
├── utils/                     # Helper functions
├── types/                     # TypeScript types
└── styles/                    # Global styles
```

## Naming Conventions

### Files
- **Modules:** `*.module.ts` (kebab-case)
- **Controllers:** `*.controller.ts` (kebab-case)
- **Services:** `*.service.ts` (kebab-case)
- **DTOs:** `create-*.dto.ts`, `update-*.dto.ts` (kebab-case)
- **Components:** `PascalCase.tsx` for React components
- **Hooks:** `use*.ts` (camelCase with 'use' prefix)
- **Types:** `*.types.ts` (kebab-case)

### Code Elements

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `TodoService`, `TransformInterceptor` |
| Interfaces | PascalCase with 'I' prefix | `ITodoService`, `IResponse` |
| Functions | camelCase | `findAll()`, `createTodo()` |
| Variables | camelCase | `todoList`, `userId` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| Enums | PascalCase | `TaskStatus`, `UserRole` |
| Private properties | camelCase with no prefix | `private prisma: PrismaService` |
| React Components | PascalCase | `TodoBoard`, `TaskCard` |

## TypeScript Usage

### Backend (NestJS)

**Type Definitions:**
```typescript
// Use interfaces for public API contracts
interface CreateTodoDto {
  title: string;
  description?: string;
  status: TaskStatus;
  position: number;
}

// Use classes for decorators and dependency injection
export class TodoService {
  constructor(private prisma: PrismaService) {}
}
```

**Return Types:**
```typescript
// Always specify return types
async findAll(): Promise<Todo[]> {
  return this.prisma.todo.findMany();
}

// Use response DTOs for API responses
async create(data: CreateTodoDto): Promise<TodoResponseDto> {
  const todo = await this.prisma.todo.create({ data });
  return new TodoResponseDto(todo);
}
```

### Frontend (React)

**Component Props:**
```typescript
// Use interfaces for component props
interface TodoCardProps {
  todo: Todo;
  onUpdate: (id: number, data: UpdateTodoData) => void;
  onDelete: (id: number) => void;
}

export function TodoCard({ todo, onUpdate, onDelete }: TodoCardProps) {
  // Component logic
}
```

**Custom Hooks:**
```typescript
// Always prefix with 'use'
function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook logic
  return { todos, loading, error, refetch };
}
```

## Code Style Guidelines

### Import Order
```typescript
// 1. Node.js built-ins
import { Injectable } from '@nestjs/common';

// 2. External packages
import { PrismaClient } from '@prisma/client';

// 3. Internal modules (absolute imports)
import { TodoService } from '@/todo/todo.service';

// 4. Relative imports
import { CreateTodoDto } from './dto/create-todo.dto';
```

### Service Layer Pattern
```typescript
@Injectable()
export class TodoService {
  // 1. Dependencies via constructor
  constructor(private prisma: PrismaService) {}

  // 2. Public methods (alphabetical order)
  async create(data: CreateTodoDto): Promise<Todo> {
    // Validation
    if (!data.title || data.title.trim().length === 0) {
      throw new BadRequestException('Title is required');
    }

    // Business logic
    const position = await this.getNextPosition(data.status);

    // Data access
    return this.prisma.todo.create({
      data: { ...data, position },
    });
  }

  // 3. Private helpers
  private async getNextPosition(status: TaskStatus): Promise<number> {
    const lastTodo = await this.prisma.todo.findFirst({
      where: { status },
      orderBy: { position: 'desc' },
    });
    return (lastTodo?.position ?? -1) + 1;
  }
}
```

### Controller Pattern
```typescript
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createTodoSchema))
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todoService.findAll();
  }
}
```

### React Component Pattern
```typescript
// 1. Import hooks
import { useState, useEffect } from 'react';

// 2. Import types
import type { Todo } from '@/types/todo';

// 3. Import components
import { Card } from '@/components/ui/Card';

// 4. Import styles
import styles from './TodoCard.module.css';

// 5. Component definition
export function TodoCard({ todo, onUpdate, onDelete }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Side effects
  }, [todo.id]);

  const handleSave = () => {
    // Event handlers
  };

  return (
    // JSX
  );
}
```

## Error Handling

### Backend
```typescript
// Use NestJS built-in exceptions
import { BadRequestException, NotFoundException, HttpException } from '@nestjs/common';

// Service layer
async remove(id: number) {
  const todo = await this.prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    throw new NotFoundException(`Todo with id ${id} not found`);
  }
  return this.prisma.todo.delete({ where: { id } });
}

// Global exception filter (optional)
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ExecutionContext) {
    // Custom error response
  }
}
```

### Frontend
```typescript
// API client with error handling
export async function getTodos(): Promise<Todo[]> {
  try {
    const response = await api.get<Todo[]>('/todo');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch todos');
    }
    throw error;
  }
}

// Component error handling
function TodoList() {
  const { data, error, isLoading } = useTodos();

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // Render component
}
```

## Comment Standards

### When to Comment
- **DO:** Explain WHY, not WHAT
- **DO:** Document complex business logic
- **DO:** Add TODO/FIXME markers for temporary code
- **DON'T:** Comment obvious code
- **DON'T:** Comment out code (delete it instead)

### Comment Style
```typescript
// GOOD: Explains WHY
// Using position to maintain order within columns for drag-and-drop
async findAll() {
  return this.prisma.todo.findMany({
    orderBy: [{ status: 'asc' }, { position: 'asc' }],
  });
}

// BAD: States the obvious
// Get all todos
async findAll() {
  return this.prisma.todo.findMany();
}

// TODO markers
// TODO: Add pagination for large datasets
// FIXME: This is a temporary workaround, refactor in v2.0
```

## Testing Standards

### Backend (Jest)
```typescript
// Test file naming: *.spec.ts
// Location: Same directory as source file

describe('TodoService', () => {
  let service: TodoService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    // Setup
  });

  describe('create', () => {
    it('should create a todo', async () => {
      // Arrange, Act, Assert
    });
  });
});
```

### Frontend (Vitest/React Testing Library)
```typescript
// Test file naming: *.test.tsx
// Location: Same directory as source file

describe('TodoCard', () => {
  it('should render todo title', () => {
    render(<TodoCard todo={mockTodo} />);
    expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
  });
});
```

## Git Commit Conventions

Follow conventional commits:
```
feat: add kanban board drag-and-drop
fix: resolve API authentication error
docs: update API documentation
refactor: simplify TodoService logic
test: add unit tests for create method
chore: update dependencies
```

## Code Review Checklist

- [ ] Follows file organization standards
- [ ] Uses correct naming conventions
- [ ] Includes TypeScript types for all functions/variables
- [ ] Handles errors appropriately
- [ ] Includes tests for new features
- [ ] Updated relevant documentation
- [ ] No console.log statements left in code
- [ ] No commented-out code
- [ ] Follows linting rules (run `pnpm run lint`)

---

**Last Updated:** 2026-01-08
**Version:** 1.0.0
