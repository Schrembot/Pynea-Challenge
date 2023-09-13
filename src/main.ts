import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { mainConfig } from './main.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  mainConfig(app);

  const config = new DocumentBuilder()
    .setTitle('Challenge API')
    .setDescription('REST API documentation for challenge')
    .setVersion('1.0')
    .addTag('Users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
