import { IsUUID, IsInt, Min, IsString, IsEmail } from 'class-validator';

export class CreateOrdenDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;
}
