import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Đăng ký Interceptor toàn cục ở đây
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  console.log('Backend is running on: http://localhost:3000/api');
}
bootstrap();
