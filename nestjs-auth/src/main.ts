import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  console.log('App in http://127.0.0.1:3000');
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
