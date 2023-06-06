import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfigInstance } from './common/infrastructure/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(appConfigInstance.PORT);
}

bootstrap();
