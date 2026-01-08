import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService

@Module({
  controllers: [TodoController],
  providers: [TodoService, PrismaService],
})
export class TodoModule {}
