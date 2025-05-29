import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orden } from './orden.entity';
import { Repository } from 'typeorm';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { Product } from '../products/products.entity';

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

  findAll() {
    return this.ordenRepository.find({ relations: ['product'] });
  }

  findOne(id: string) {
    return this.ordenRepository.findOne({ where: { id }, relations: ['product'] });
  }
}
