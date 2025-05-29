import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Esto elimina propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Esto lanza error si se envían propiedades extra
  }));
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
