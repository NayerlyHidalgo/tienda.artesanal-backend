import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from '../products/products.entity';

@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @CreateDateColumn()
  createdAt: Date;
}
