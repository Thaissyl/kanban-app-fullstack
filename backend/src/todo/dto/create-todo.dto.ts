import { z } from 'zod';

// Định nghĩa Enum giống như trong Prisma
export const TaskStatus = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);

// 1. Định nghĩa Schema bằng Zod
export const createTodoSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().optional(), // Thêm mô tả (không bắt buộc)
    status: TaskStatus.optional(), // Mặc định là TODO
    position: z.number().int().optional().default(0), // Vị trí trong cột
}).strict(); // strict() để ngăn chặn các field lạ gửi lên

// 2. Tự động suy luận Type từ Schema (giúp bạn không phải viết Interface thủ công)
export class CreateTodoDto {
    title: string;
    description?: string;
    status?: z.infer<typeof TaskStatus>;
    position?: number;
}