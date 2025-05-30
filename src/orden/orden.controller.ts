import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, BadRequestException, NotFoundException,
  UseInterceptors, UploadedFile,
  InternalServerErrorException
} from '@nestjs/common';
import { OrdenService } from './orden.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Orden } from './orden.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('orden')
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Post()
  async create(@Body() dto: CreateOrdenDto) {
    const orden = await this.ordenService.create(dto);
    return new SuccessResponseDto('Orden creada exitosamente', orden);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('isActive') isActive?: string,
  ): Promise<SuccessResponseDto<Pagination<Orden>>> {
    if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
      throw new BadRequestException('Valor inválido para "isActive". Usa "true" o "false".');
    }
    const result = await this.ordenService.findAll({ page, limit }, isActive === 'true');
    if (!result) throw new InternalServerErrorException('No se pudieron obtener las órdenes');
    return new SuccessResponseDto('Órdenes obtenidas exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const orden = await this.ordenService.findOne(id);
    if (!orden) throw new NotFoundException('Orden no encontrada');
    return new SuccessResponseDto('Orden obtenida exitosamente', orden);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrdenDto) {
    const orden = await this.ordenService.update(id, dto);
    if (!orden) throw new NotFoundException('Orden no encontrada');
    return new SuccessResponseDto('Orden actualizada exitosamente', orden);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const orden = await this.ordenService.remove(id);
    if (!orden) throw new NotFoundException('Orden no encontrada');
    return new SuccessResponseDto('Orden eliminada exitosamente', orden);
  }

  @Put(':id/factura')
  @UseInterceptors(FileInterceptor('factura', {
    storage: diskStorage({
      destination: './public/factura',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(pdf|jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Solo se permiten archivos PDF, JPG o PNG'), false);
      }
      cb(null, true);
    }
  }))
  async uploadFactura(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('El archivo de factura es requerido');
    const orden = await this.ordenService.updateFactura(id, file.filename);
    if (!orden) throw new NotFoundException('Orden no encontrada');
    return new SuccessResponseDto('Factura actualizada', orden);
  }
}
