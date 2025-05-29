import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAllPaginated(options: IPaginationOptions): Promise<Pagination<Product>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    queryBuilder.orderBy('product.createdAt', 'DESC');
    return paginate<Product>(queryBuilder, options);
  }

  async findById(id: string) {
    return this.productsRepository.findOne({ where: { id } });
  }

  async createMany(createProductsDtoArray: CreateProductsDto[]) {
    const products = this.productsRepository.create(createProductsDtoArray);
    return this.productsRepository.save(products);
  }

  async create(createProductsDto: CreateProductsDto) {
    const product = this.productsRepository.create(createProductsDto);
    return this.productsRepository.save(product);
  }

  async update(id: string, updateProductsDto: UpdateProductsDto) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, updateProductsDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.productsRepository.remove(product);
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findAll(options: FindProductsDto) {
    const { page = 1, limit = 10, isActive } = options;
    const take = Math.min(Number(limit) || 10, 100);
    const skip = (Number(page) - 1) * take;

    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.productsRepository.find({
      where,
      skip,
      take,
    });
  }

  async updateProfile(id: string, profile: string) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    product.profile = profile;
    return this.productsRepository.save(product);
  }
}