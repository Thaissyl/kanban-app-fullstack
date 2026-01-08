import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            // Parse dữ liệu dựa trên schema
            const parseValue = this.schema.parse(value);
            return parseValue;
        } catch (error) {
            throw new BadRequestException('Dữ liệu không hợp lệ', {
                cause: error,
                description: error.errors,
            });
        }
    }
}