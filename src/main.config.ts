import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

export function mainConfig(app: INestApplication) {
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
}
