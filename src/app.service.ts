import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Todo } from './common/interfaces/todo.interface';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}

  async getTodos(): Promise<Todo[]> {
    const { data } = await this.httpService.axiosRef.get<Todo[]>(
      'https://jsonplaceholder.typicode.com/todos',
    );

    await this.cacheManager.set('todos', data);

    return data;
  }
}
