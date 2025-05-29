import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // Ej: mochila, billetera, etc.

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  material?: string; // Ej: cuero de vaca

  @Column({ nullable: true })
  color?: string; // Ej: marrón, negro

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profile?: string;
}
