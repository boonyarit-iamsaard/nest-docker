import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/services/prisma.service';

async function bootstrap() {
  const levels: LogLevel[] =
    process.env.NOED_ENV === 'production'
      ? ['error', 'log', 'warn']
      : ['debug', 'error', 'log', 'warn', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: levels,
  });

  // 👇 Listen to Prisma 'beforeExit' event
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(3000);
}
bootstrap();
