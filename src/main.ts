import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const levels: LogLevel[] =
    process.env.NOED_ENV === 'production'
      ? ['error', 'log', 'warn']
      : ['debug', 'error', 'log', 'warn', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: levels,
  });

  await app.listen(3000);
}
bootstrap();
