import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Định nghĩa giao diện cho dữ liệu trả về
export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => ({
                success: true,
                data, // Đây chính là dữ liệu mà Service trả về
                timestamp: new Date().toISOString(),
            })),
        );
    }


}