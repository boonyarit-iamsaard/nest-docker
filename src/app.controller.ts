import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Todo } from './common/interfaces/todo.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 👇 Automatically cache the response for 120 seconds
  @UseInterceptors(CacheInterceptor)
  @CacheKey('todos')
  @CacheTTL(120)
  @Get()
  getTodos(): Promise<Todo[]> {
    return this.appService.getTodos();
  }
}
