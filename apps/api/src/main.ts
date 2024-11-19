import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './execption.filter';
import { CustomValidationPipe } from './shared/val.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 8000);
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true, // Ensures plain objects are converted to class instances
      whitelist: true, // Strips properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws error for unexpected properties
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
}
bootstrap();
