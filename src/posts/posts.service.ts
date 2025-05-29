import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Category } from '../categories/category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post | null> {
    try {
      const category = await this.categoriesRepository.findOne({ where: { id: createPostDto.categoryId } });
      if (!category) return null;

      const post = this.postsRepository.create({
        title: createPostDto.title,
        content: createPostDto.content,
        category: category,
      });

      return await this.postsRepository.save(post);
    } catch (err) {
      console.error('Error creating post:', err);
      return null;
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Post> | null> {
    try {
      const queryBuilder = this.postsRepository.createQueryBuilder('post');
      queryBuilder.leftJoinAndSelect('post.category', 'category');
      return await paginate<Post>(queryBuilder, options);
    } catch (err) {
      console.error('Error fetching posts:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Post | null> {
    try {
      return await this.postsRepository.findOne({ where: { id }, relations: ['category'] });
    } catch (err) {
      console.error('Error fetching post:', err);
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.postsRepository.delete(id);
      return result.affected !== 0;
    } catch (err) {
      console.error('Error deleting post:', err);
      return false;
    }
  }
}
