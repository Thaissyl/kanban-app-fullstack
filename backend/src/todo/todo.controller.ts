import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { TodoService } from './todo.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createTodoSchema } from './dto/create-todo.dto';
import type { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  // Sử dụng Pipe đã tạo và truyền Schema tương ứng vào
  @UsePipes(new ZodValidationPipe(createTodoSchema))
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Patch(':id/move')
  moveTask(
    @Param('id') id: string,
    @Body() updateData: { status: 'TODO' | 'IN_PROGRESS' | 'DONE', position: number }) {
    return this.todoService.updateStatus(+id, updateData.status, updateData.position)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
