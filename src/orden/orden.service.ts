import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orden } from './orden.entity';
import { Repository } from 'typeorm';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { Product } from '../products/products.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class OrdenService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateOrdenDto) {
    const product = await this.productRepository.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    const total = Number(product.price) * dto.quantity;
    const orden = this.ordenRepository.create({
      product,
      quantity: dto.quantity,
      total,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
    });
    return this.ordenRepository.save(orden);
  }

  async findAll(
    options: { page?: number; limit?: number },
    isActive?: boolean,
  ): Promise<Pagination<Orden>> {
    const { page = 1, limit = 10 } = options;
    const queryBuilder = this.ordenRepository.createQueryBuilder('orden')
      .leftJoinAndSelect('orden.product', 'product')
      .orderBy('orden.createdAt', 'DESC');
    // If you want to filter by isActive, add a column and filter here.
    return paginate<Orden>(queryBuilder, { page, limit });
  }

  async findOne(id: string) {
    const orden = await this.ordenRepository.findOne({ where: { id }, relations: ['product'] });
    if (!orden) throw new NotFoundException('Orden no encontrada');
    return orden;
  }

  async update(id: string, dto: UpdateOrdenDto) {
    const orden = await this.ordenRepository.findOne({ where: { id }, relations: ['product'] });
    if (!orden) return null;
    if (dto.quantity !== undefined && orden.product) {
      orden.quantity = dto.quantity;
      orden.total = Number(orden.product.price) * dto.quantity;
    }
    if (dto.customerName !== undefined) orden.customerName = dto.customerName;
    if (dto.customerEmail !== undefined) orden.customerEmail = dto.customerEmail;
    return this.ordenRepository.save(orden);
  }

  async remove(id: string) {
    const orden = await this.ordenRepository.findOne({ where: { id } });
    if (!orden) return null;
    return this.ordenRepository.remove(orden);
  }

  async updateFactura(id: string, facturaFilename: string) {
    const orden = await this.ordenRepository.findOne({ where: { id } });
    if (!orden) return null;
    // Add a factura field to the entity if not present
    (orden as any).factura = facturaFilename;
    return this.ordenRepository.save(orden);
  }
}
