import { Controller, Get, Post, Body, Param, Put, Delete, Query, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createMany(@Body() products: CreateProductsDto[]) {
    const createdProducts = await this.productsService.createMany(products);
    return new SuccessResponseDto('Products created', createdProducts);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('active') active?: string,
  ): Promise<SuccessResponseDto> {
    if (active !== undefined && active !== 'true' && active !== 'false') {
      throw new BadRequestException('Invalid value for "active" query param. Use "true" or "false".');
    }
    limit = limit > 100 ? 100 : limit;
    const products = await this.productsService.findAll({
      page,
      limit,
      isActive: active === undefined ? undefined : active === 'true',
    });
    return new SuccessResponseDto('Products retrieved', products);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    return new SuccessResponseDto('Product retrieved', product);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductsDto) {
    const product = await this.productsService.update(id, dto);
    return new SuccessResponseDto('Product updated', product);
  }

  @Put(':id/profile')
  @UseInterceptors(FileInterceptor('profile', {
    storage: diskStorage({
      destination: './public/profile',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Only JPG or PNG files are allowed'), false);
      }
      cb(null, true);
    }
  }))
  async uploadProfile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Profile image is required');
    const product = await this.productsService.updateProfile(id, file.filename);
    return new SuccessResponseDto('Profile image updated', product);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return new SuccessResponseDto('Product deleted');
  }
}
