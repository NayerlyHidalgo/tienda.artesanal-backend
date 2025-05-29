import { IsNotEmpty, IsString, IsEnum, IsOptional, IsInt, Min, IsNumber } from 'class-validator';

export enum ProductType {
    MOCHILA = 'mochila',
    BILLETERA = 'billetera',
    LLAVERO = 'llavero',
    CARTERA = 'cartera',
    PORTATITULOS = 'portatitulos',
}
export class CreateProductsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ProductType)
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  material?: string; // Ejemplo: "cuero de vaca"

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}