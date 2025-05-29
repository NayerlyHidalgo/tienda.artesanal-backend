import {
  Controller,
  Post as HttpPost,
  Get,
  Param,
  Delete,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './post.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto): Promise<SuccessResponseDto<PostEntity>> {
    const post = await this.postsService.create(createPostDto);
    if (!post) throw new NotFoundException('Category not found or error creating post');
    return new SuccessResponseDto('Post created successfully', post);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<Pagination<PostEntity>>> {
    limit = limit > 100 ? 100 : limit;
    const result = await this.postsService.findAll({ page, limit });

    if (!result) throw new InternalServerErrorException('Could not retrieve posts');

    return new SuccessResponseDto('Posts retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponseDto<PostEntity>> {
    const post = await this.postsService.findOne(id);
    if (!post) throw new NotFoundException('Post not found');
    return new SuccessResponseDto('Post retrieved successfully', post);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SuccessResponseDto<string>> {
    const deleted = await this.postsService.remove(id);
    if (!deleted) throw new NotFoundException('Post not found or could not be deleted');
    return new SuccessResponseDto('Post deleted successfully', id);
  }
}
