import { Controller, Get, Post, Body, Param, Put, Delete, Query, BadRequestException, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

/*
@Controller('users')
//@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('paginated')
  findAllPaginated(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.findAllPaginated({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
*/

@Controller('users')
//@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return new SuccessResponseDto('User created', user);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('active') active?: string,
  ): Promise<SuccessResponseDto> {
    // Validar "active"
    if (active !== undefined && active !== 'true' && active !== 'false') {
      throw new BadRequestException('Invalid value for "active" query param. Use "true" or "false".');
    }

    // Limitar cantidad máxima
    limit = limit > 100 ? 100 : limit;

    // Obtener usuarios desde el servicio
    const users = await this.usersService.findAll({
      page,
      limit,
      isActive: active === undefined ? undefined : active === 'true',
    });

    // Envolver en DTO exitoso
    return new SuccessResponseDto('Users retrieved', users);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const user = await this.usersService.findOne(id);
    return new SuccessResponseDto('User retrieved', user);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    return new SuccessResponseDto('User updated', user);
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
    const user = await this.usersService.updateProfile(id, file.filename);
    return new SuccessResponseDto('Profile image updated', user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.usersService.remove(id);
    return new SuccessResponseDto('User deleted');
  }
}
