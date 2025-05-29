import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenController } from './orden.controller';
import { OrdenService } from './orden.service';
import { Orden } from './orden.entity';
import { Product } from '../products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orden, Product])],
  controllers: [OrdenController],
  providers: [OrdenService],
  exports: [OrdenService],
})
export class OrdenModule {}
