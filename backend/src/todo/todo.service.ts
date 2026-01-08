import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        position: data.position,
      },
    });
  }

  async findAll() {
    // Trả về danh sách được sắp xếp theo vị trí
    return this.prisma.todo.findMany({
      orderBy: [
        { status: 'asc' }, // Sắp xếp theo cột trước
        { position: 'asc' } // Rồi sắp xếp theo vị trí trong cột
      ],
    });
  }

  async updateStatus(id: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE', position: number) {
    return this.prisma.todo.update({
      where: { id },
      data: {
        status,
        position
      },
    });
  }

  async remove(id: number) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
