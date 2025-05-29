import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { CreateOrdenDto } from './dto/create-orden.dto';

@Controller('orden')
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Post()
  create(@Body() dto: CreateOrdenDto) {
    return this.ordenService.create(dto);
  }

  @Get()
  findAll() {
    return this.ordenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenService.findOne(id);
  }
}
