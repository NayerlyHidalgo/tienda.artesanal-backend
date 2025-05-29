import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Esta es una aoo hecha con los Genios de Programacion III';
  }
}
